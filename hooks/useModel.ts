"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import ModelLoader from "@/lib/modelLoader";
import type { ModelStatus } from "@/types";

interface UseModelReturn {
  status: ModelStatus;
  error: string | null;
  loadProgress: number;
  model: tf.LayersModel | null;
}

export function useModel(): UseModelReturn {
  const [status, setStatus] = useState<ModelStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const startProgressSimulation = useCallback(() => {
    setLoadProgress(0);
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 95) {
          return 95;
        }
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 95);
      });
    }, 150);
    progressIntervalRef.current = interval;
  }, []);

  const completeProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setLoadProgress(100);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setStatus("loading");
      startProgressSimulation();

      try {
        const loader = ModelLoader.getInstance();
        await loader.loadModel();
        await loader.warmup();

        if (cancelled) return;

        completeProgress();
        setModel(loader.getModel());
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;

        completeProgress();
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load AI model. Please check that model files exist in /public/model/"
        );
      }
    }

    init();

    return () => {
      cancelled = true;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [startProgressSimulation, completeProgress]);

  return { status, error, loadProgress, model };
}
