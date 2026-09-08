"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatBytes, isImageFile, pickIncomingFile } from "@/lib/files";

type Props = {
  accept: string;
  file?: File | null;
  disabled?: boolean;
  hot?: boolean;
  compact?: boolean;
  title: string;
  hint: string;
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  onClear?: () => void;
};

export default function FileDropZone({
  accept,
  file,
  disabled,
  hot,
  compact,
  title,
  hint,
  onFile,
  onError,
  onClear,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localHot, setLocalHot] = useState(false);
  const [preview, setPreview] = useState("");
  const depth = useRef(0);
  const active = !disabled && (hot || localHot);

  useEffect(() => {
    if (!file || !isImageFile(file)) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const take = (list: FileList | File[] | null) => {
    if (disabled || !list) return;
    const picked = pickIncomingFile(Array.from(list), accept);
    if (picked.error) {
      onError?.(picked.error);
      return;
    }
    if (picked.file) onFile(picked.file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <label
      htmlFor={inputId}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        depth.current += 1;
        setLocalHot(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setLocalHot(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = disabled ? "none" : "copy";
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        depth.current = 0;
        setLocalHot(false);
        take(e.dataTransfer.files);
      }}
      className={`block cursor-pointer rounded-[22px] border-2 border-dashed text-center outline-none transition ${
        compact ? "px-3 py-4" : "px-6 py-10"
      } ${
        disabled
          ? "cursor-not-allowed border-[#E7E5E4] bg-[#FAFAF9] opacity-60"
          : active
            ? "border-[#1677FF] bg-[#E6F4FF] shadow-[inset_0_0_0_1px_#1677FF]"
            : file
              ? "border-[#86EFAC] bg-[#ECFDF5]"
              : "border-[#E7E5E4] bg-white hover:border-[#1677FF] hover:bg-[#F8FBFF]"
      }`}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => take(e.target.files)}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className={`mx-auto mb-3 rounded-xl object-contain ${compact ? "max-h-16" : "max-h-40"}`} />
      ) : (
        <span
          className={`mx-auto mb-2 flex items-center justify-center rounded-2xl ${compact ? "h-9 w-9 text-lg" : "h-12 w-12 text-2xl"} ${
            active ? "bg-white text-[#1677FF]" : "bg-[#F1F5F9] text-[#64748B]"
          }`}
          aria-hidden
        >
          {active ? "↓" : "⇪"}
        </span>
      )}
      <p className={`font-extrabold ${compact ? "text-sm" : "text-base"} ${active ? "text-[#1677FF]" : "text-[#1C1917]"}`}>
        {disabled ? "Envoi en cours…" : active ? "Relâche pour déposer" : file ? file.name : title}
      </p>
      <p className="mt-1 text-xs font-semibold text-[#94A3B8]">
        {file && !active ? formatBytes(file.size) : hint}
      </p>
      {file && onClear && !active ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClear();
          }}
          className="mt-2 text-xs font-extrabold text-[#EF4444]"
        >
          Retirer
        </button>
      ) : null}
    </label>
  );
}
