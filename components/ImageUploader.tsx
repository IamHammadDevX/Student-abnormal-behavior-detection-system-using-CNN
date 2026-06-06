"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { ModelStatus } from "@/types";

interface ImageUploaderProps {
  onImageSelected: (file: File, imageElement: HTMLImageElement) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  modelStatus: ModelStatus;
  loadProgress: number;
  modelError: string | null;
  hasResult: boolean;
}

export default function ImageUploader({
  onImageSelected,
  onAnalyze,
  isAnalyzing,
  modelStatus,
  loadProgress,
  modelError,
  hasResult,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (selectedFile: File) => {
      if (!selectedFile.type.startsWith("image/")) return;

      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        onImageSelected(selectedFile, img);
      };
      img.src = url;
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFile(selectedFile);
    },
    [handleFile]
  );

  const handleAnalyze = useCallback(() => {
    if (file && modelStatus === "ready") {
      onAnalyze();
    }
  }, [file, modelStatus, onAnalyze]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Model Status Indicator */}
        <div className="mb-4 flex items-center gap-2">
          {modelStatus === "ready" && (
            <>
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">
                Model Ready
              </span>
            </>
          )}
          {modelStatus === "loading" && (
            <>
              <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-500" />
              <span className="text-xs text-muted-foreground">
                Loading Model...
              </span>
            </>
          )}
          {modelStatus === "error" && (
            <>
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-xs text-destructive">Model Error</span>
            </>
          )}
          {modelStatus === "idle" && (
            <>
              <span className="flex h-2.5 w-2.5 rounded-full bg-gray-400" />
              <span className="text-xs text-muted-foreground">
                Initializing...
              </span>
            </>
          )}
        </div>

        {/* Loading Progress */}
        <AnimatePresence>
          {modelStatus === "loading" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading AI Model...
                </span>
                <span className="text-xs font-medium">
                  {Math.round(loadProgress)}%
                </span>
              </div>
              <Progress value={loadProgress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {modelStatus === "error" && modelError && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{modelError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drop Zone */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
          aria-label="Upload classroom image"
          className={`
            relative flex cursor-pointer flex-col items-center justify-center
            rounded-2xl border-2 border-dashed p-8
            transition-all duration-200
            ${
              isDragOver
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-accent/50"
            }
            ${file ? "pb-4" : "min-h-[280px]"}
          `}
          whileHover={{ scale: file ? 1 : 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            aria-hidden="true"
          />

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="relative w-full max-w-xs overflow-hidden rounded-xl border shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Uploaded classroom preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {file?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file && formatFileSize(file.size)}
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-destructive transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove & choose another
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">
                    Upload classroom image
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drag & drop or click to browse
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>JPG, PNG, WEBP supported</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Analyze Button */}
        <motion.div
          className="mt-4"
          initial={false}
          animate={{ y: 0 }}
        >
          <Button
            onClick={handleAnalyze}
            disabled={!file || modelStatus !== "ready" || isAnalyzing}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-5 w-5" />
                Analyze Image
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
