"use client";

export type SfxKind = "click" | "correct" | "wrong" | "warn" | "timesUp";

/** Le site vitrine reste muet — les animations de Spira remplacent le son. */
export function preloadSfx() {}

export function playSfx(_kind: SfxKind) {}
