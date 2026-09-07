#!/usr/bin/env python3
"""Recalcule le classement LearnFlow à partir de l'historique réel.

Sans faux profils : uniquement les élèves de student_profiles / league_scores.
Chaque élève commence en Bronze (0 XP). Le rang suit l'XP de la semaine
(activité xp_gain). À égalité, le plus récent est dernier.

Usage (depuis la racine du repo, avec les clés service) :
  python supabase/scripts/update_leagues.py
  python supabase/scripts/update_leagues.py --promote
  python supabase/scripts/update_leagues.py --reset-week

Variables d'environnement :
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY  (ou SUPABASE_SECRET_KEY)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

TIERS = ["Bronze", "Argent", "Or", "Platine", "Diamant"]
PROMOTE_TOP = 10
DEMOTE_BOTTOM = 5
MIN_GROUP_FOR_MOVE = 15


def load_dotenv() -> None:
    for candidate in (
        Path(__file__).resolve().parents[1] / ".env",
        Path(__file__).resolve().parents[2] / ".env",
        Path.cwd() / ".env",
    ):
        if not candidate.is_file():
            continue
        for raw in candidate.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            os.environ.setdefault(key, value)


def monday_utc() -> str:
    now = datetime.now(timezone.utc)
    start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc) - timedelta(days=now.weekday())
    return start.isoformat().replace("+00:00", "Z")


class Supabase:
    def __init__(self, url: str, key: str) -> None:
        self.url = url.rstrip("/")
        self.key = key

    def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, str] | None = None,
        body: Any = None,
        prefer: str | None = None,
    ) -> Any:
        query = f"?{urllib.parse.urlencode(params)}" if params else ""
        req = urllib.request.Request(
            f"{self.url}{path}{query}",
            data=None if body is None else json.dumps(body).encode("utf-8"),
            method=method,
            headers={
                "apikey": self.key,
                "Authorization": f"Bearer {self.key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )
        if prefer:
            req.add_header("Prefer", prefer)
        try:
            with urllib.request.urlopen(req) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"{method} {path} → {exc.code}: {detail}") from exc

    def get(self, table: str, params: dict[str, str]) -> list[dict[str, Any]]:
        rows = self.request("GET", f"/rest/v1/{table}", params=params)
        return rows if isinstance(rows, list) else []

    def patch(self, table: str, match: dict[str, str], body: dict[str, Any]) -> None:
        self.request(
            "PATCH",
            f"/rest/v1/{table}",
            params=match,
            body=body,
            prefer="return=minimal",
        )


def weekly_xp_from_history(db: Supabase, since: str) -> dict[str, int]:
    events = db.get(
        "activity_events",
        {
            "select": "student_id,payload,created_at",
            "type": "eq.xp_gain",
            "created_at": f"gte.{since}",
            "limit": "10000",
        },
    )
    totals: dict[str, int] = {}
    for row in events:
        sid = str(row.get("student_id") or "")
        payload = row.get("payload") or {}
        if isinstance(payload, str):
            try:
                payload = json.loads(payload)
            except json.JSONDecodeError:
                payload = {}
        amount = 0
        if isinstance(payload, dict):
            raw = payload.get("amount") or payload.get("xp") or 0
            try:
                amount = int(raw)
            except (TypeError, ValueError):
                amount = 0
        if sid:
            totals[sid] = totals.get(sid, 0) + max(0, amount)
    return totals


def ensure_scores(db: Supabase, profiles: list[dict[str, Any]], scores: list[dict[str, Any]]) -> list[dict[str, Any]]:
    known = {str(row["student_id"]) for row in scores}
    created = 0
    for profile in profiles:
        sid = str(profile["id"])
        if sid in known:
            continue
        db.request(
            "POST",
            "/rest/v1/league_scores",
            body={
                "student_id": sid,
                "league_tier": "Bronze",
                "weekly_xp": 0,
            },
            prefer="return=minimal,resolution=ignore-duplicates",
        )
        created += 1
        known.add(sid)
    if created:
        print(f"Nouveaux élèves placés en Bronze : {created}")
        scores = db.get(
            "league_scores",
            {"select": "id,student_id,league_tier,weekly_xp,last_sync", "limit": "5000"},
        )
    return scores


def apply_weekly_xp(db: Supabase, scores: list[dict[str, Any]], weekly: dict[str, int], reset: bool) -> None:
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    for row in scores:
        sid = str(row["student_id"])
        if sid in weekly:
            xp = weekly[sid]
        elif reset:
            xp = 0
        else:
            xp = int(row.get("weekly_xp") or 0)
        if int(row.get("weekly_xp") or 0) == xp:
            continue
        db.patch(
            "league_scores",
            {"student_id": f"eq.{sid}"},
            {"weekly_xp": xp, "last_sync": now},
        )
        row["weekly_xp"] = xp


def promote_demote(db: Supabase, scores: list[dict[str, Any]]) -> None:
    by_tier: dict[str, list[dict[str, Any]]] = {tier: [] for tier in TIERS}
    for row in scores:
        tier = str(row.get("league_tier") or "Bronze")
        if tier not in by_tier:
            tier = "Bronze"
        by_tier[tier].append(row)

    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    moves = 0
    for index, tier in enumerate(TIERS):
        group = sorted(
            by_tier[tier],
            key=lambda r: (-int(r.get("weekly_xp") or 0), str(r.get("last_sync") or "")),
        )
        if len(group) < MIN_GROUP_FOR_MOVE:
            continue
        promote_n = min(PROMOTE_TOP, max(1, len(group) // 3))
        demote_n = min(DEMOTE_BOTTOM, max(1, len(group) // 6))
        if index < len(TIERS) - 1:
            for row in group[:promote_n]:
                nxt = TIERS[index + 1]
                db.patch(
                    "league_scores",
                    {"student_id": f"eq.{row['student_id']}"},
                    {"league_tier": nxt, "weekly_xp": 0, "last_sync": now},
                )
                row["league_tier"] = nxt
                row["weekly_xp"] = 0
                moves += 1
        if index > 0:
            for row in group[-demote_n:]:
                prev = TIERS[index - 1]
                db.patch(
                    "league_scores",
                    {"student_id": f"eq.{row['student_id']}"},
                    {"league_tier": prev, "weekly_xp": 0, "last_sync": now},
                )
                row["league_tier"] = prev
                row["weekly_xp"] = 0
                moves += 1
    print(f"Montées / descentes : {moves}")


def print_board(scores: list[dict[str, Any]], names: dict[str, str]) -> None:
    by_tier: dict[str, list[dict[str, Any]]] = {tier: [] for tier in TIERS}
    for row in scores:
        tier = str(row.get("league_tier") or "Bronze")
        by_tier.setdefault(tier, []).append(row)
    for tier in TIERS:
        group = sorted(
            by_tier.get(tier, []),
            key=lambda r: (-int(r.get("weekly_xp") or 0), str(r.get("last_sync") or "")),
        )
        print(f"\n=== {tier} ({len(group)}) ===")
        if not group:
            print("  (vide)")
            continue
        for i, row in enumerate(group, start=1):
            sid = str(row["student_id"])
            label = names.get(sid, "Élève")
            print(f"  #{i:02d}  {int(row.get('weekly_xp') or 0):5d} XP  {label}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Recalcule les ligues LearnFlow.")
    parser.add_argument("--promote", action="store_true", help="Fin de semaine : top monte, bas descend.")
    parser.add_argument("--reset-week", action="store_true", help="Remet l'XP hebdo à l'historique de la semaine en cours.")
    args = parser.parse_args()

    load_dotenv()
    url = (os.environ.get("SUPABASE_URL") or os.environ.get("EXPO_PUBLIC_SUPABASE_URL") or "").strip()
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_SECRET_KEY")
        or ""
    ).strip()
    if not url or not key:
        print("Il manque SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.", file=sys.stderr)
        return 1

    db = Supabase(url, key)
    profiles = db.get("student_profiles", {"select": "id,name,total_xp,class_level", "limit": "5000"})
    scores = db.get("league_scores", {"select": "id,student_id,league_tier,weekly_xp,last_sync", "limit": "5000"})
    names = {str(p["id"]): str(p.get("name") or "Élève") for p in profiles}

    scores = ensure_scores(db, profiles, scores)
    weekly = weekly_xp_from_history(db, monday_utc())
    apply_weekly_xp(db, scores, weekly, reset=args.reset_week)

    if args.promote:
        promote_demote(db, scores)
        scores = db.get(
            "league_scores",
            {"select": "id,student_id,league_tier,weekly_xp,last_sync", "limit": "5000"},
        )

    print_board(scores, names)
    print("\nClassement actualisé.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
