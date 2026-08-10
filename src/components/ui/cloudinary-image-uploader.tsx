"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { uploadWorkerPhotoAction } from "@/app/_actions/worker-onboarding";

type CloudinaryImageUploaderProps = {
  folder: "profile" | "gallery" | "review";
  label: string;
  hint?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles: number;
  minFiles?: number;
};

export function CloudinaryImageUploader({
  folder,
  label,
  hint,
  value,
  onChange,
  maxFiles,
  minFiles = 0,
}: CloudinaryImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canAddMore = value.length < maxFiles;

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !canAddMore) return;

    setError(null);
    setIsUploading(true);

    const nextUrls = [...value];

    try {
      for (const file of Array.from(files)) {
        if (nextUrls.length >= maxFiles) break;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const result = await uploadWorkerPhotoAction(formData);
        if ("error" in result && result.error) {
          setError(result.error);
          break;
        }

        if (result.url) {
          nextUrls.push(result.url);
        }
      }

      onChange(nextUrls);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}

      <div className="mt-3 flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative h-24 w-24 overflow-hidden border border-slate-200 bg-slate-100"
          >
            <Image src={url} alt={`Imagen ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-slate-900/80 text-white"
              aria-label="Quitar imagen"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canAddMore ? (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 border border-dashed border-slate-300 bg-white text-slate-600 transition-colors hover:border-slate-400 disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Subir</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <p className="mt-2 text-[11px] text-slate-500">
        {value.length}/{maxFiles} imágenes
        {minFiles > 0 ? ` · mínimo ${minFiles}` : ""}. Se guardan optimizadas
        automáticamente.
      </p>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
