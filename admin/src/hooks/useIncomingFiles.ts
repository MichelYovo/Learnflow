"use client";

import { useEffect, useRef, useState } from "react";
import { filesFromClipboard, filesFromDataTransfer, pickIncomingFile, transferHasFiles } from "@/lib/files";

type Opts = {
  accept: string;
  enabled?: boolean;
  onFile: (file: File) => void;
  onError?: (message: string) => void;
};

/** Glisser-déposer / coller n’importe où sur la page, comme dans Drive ou Slack. */
export function useIncomingFiles({ accept, enabled = true, onFile, onError }: Opts) {
  const [dragging, setDragging] = useState(false);
  const onFileRef = useRef(onFile);
  const onErrorRef = useRef(onError);
  const acceptRef = useRef(accept);
  const enabledRef = useRef(enabled);
  onFileRef.current = onFile;
  onErrorRef.current = onError;
  acceptRef.current = accept;
  enabledRef.current = enabled;

  useEffect(() => {
    let leaveTimer = 0;

    const take = (files: File[]) => {
      if (!enabledRef.current) return false;
      const picked = pickIncomingFile(files, acceptRef.current);
      if (picked.error) {
        onErrorRef.current?.(picked.error);
        return false;
      }
      if (picked.file) onFileRef.current(picked.file);
      return true;
    };

    const onDragOver = (e: DragEvent) => {
      if (!transferHasFiles(e.dataTransfer)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      if (!enabledRef.current) return;
      window.clearTimeout(leaveTimer);
      setDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
      if (e.relatedTarget) return;
      leaveTimer = window.setTimeout(() => setDragging(false), 80);
    };

    const onDrop = (e: DragEvent) => {
      if (!transferHasFiles(e.dataTransfer)) return;
      e.preventDefault();
      setDragging(false);
      take(filesFromDataTransfer(e.dataTransfer));
    };

    const onPaste = (e: ClipboardEvent) => {
      const files = filesFromClipboard(e);
      if (!files.length) return;
      if (take(files)) e.preventDefault();
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("paste", onPaste);
    return () => {
      window.clearTimeout(leaveTimer);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  return { dragging };
}
