export interface Prediction {
  className: string;
  confidence: number;
  rank: number;
}

export interface InferenceResult {
  topPrediction: Prediction;
  allPredictions: Prediction[];
  inferenceTimeMs: number;
}

export type ModelStatus = "idle" | "loading" | "ready" | "error";

export interface ClassInfo {
  label: string;
  description: string;
  color: string;
  icon: string;
}
