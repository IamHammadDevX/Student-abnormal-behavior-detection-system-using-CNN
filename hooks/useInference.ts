"use client";

import { useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import { preprocessImage } from "@/lib/preprocessing";
import { CLASS_NAMES } from "@/lib/constants";
import type { InferenceResult, Prediction } from "@/types";

interface UseInferenceReturn {
  runInference: (
    imageElement: HTMLImageElement | HTMLCanvasElement
  ) => Promise<InferenceResult>;
  isRunning: boolean;
  error: string | null;
}

export function useInference(
  model: tf.LayersModel | null
): UseInferenceReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runInference = useCallback(
    async (
      imageElement: HTMLImageElement | HTMLCanvasElement
    ): Promise<InferenceResult> => {
      if (!model) {
        throw new Error("Model not loaded yet");
      }

      setIsRunning(true);
      setError(null);

      const startTime = performance.now();
      let inputTensor: tf.Tensor4D | null = null;
      let outputTensor: tf.Tensor | null = null;

      try {
        inputTensor = preprocessImage(imageElement);
        outputTensor = model.predict(inputTensor) as tf.Tensor;

        const probabilities = await outputTensor.array();
        const probs = (probabilities as number[][]).flat();

        const predictions: Prediction[] = probs
          .map((prob, i) => ({
            className: CLASS_NAMES[i],
            confidence: prob,
            rank: 0,
          }))
          .sort((a, b) => b.confidence - a.confidence)
          .map((pred, i) => ({
            ...pred,
            rank: i + 1,
          }));

        const inferenceTimeMs = performance.now() - startTime;

        return {
          topPrediction: predictions[0],
          allPredictions: predictions,
          inferenceTimeMs: Math.round(inferenceTimeMs),
        };
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Inference failed";
        setError(msg);
        throw err;
      } finally {
        if (inputTensor) inputTensor.dispose();
        if (outputTensor) outputTensor.dispose();
        setIsRunning(false);
      }
    },
    [model]
  );

  return { runInference, isRunning, error };
}
