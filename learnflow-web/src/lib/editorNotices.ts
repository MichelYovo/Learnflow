import { getBrowserSupabase } from "./supabase";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export type EditorNotice = {
  id: string;
  title: string;
  body: string;
  created_at?: string;
};

export async function pullEditorNotices(): Promise<void> {
  try {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("editor_notices")
      .select("id, title, body, created_at")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(8);
    if (error || !Array.isArray(data)) return;
    const store = useLearnFlowStore.getState();
    for (const row of data as EditorNotice[]) {
      if (!row?.id || !row.title || !row.body) continue;
      store.pushInbox({
        id: `editor-${row.id}`,
        kind: "system",
        title: row.title,
        body: row.body,
      });
    }
  } catch {
    /* table absente ou hors-ligne */
  }
}
