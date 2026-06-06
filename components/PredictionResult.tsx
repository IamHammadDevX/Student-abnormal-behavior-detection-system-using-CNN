"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CLASS_INFO, CONFIDENCE_THRESHOLDS } from "@/lib/constants";
import type { InferenceResult } from "@/types";

interface PredictionResultProps {
  result: InferenceResult | null;
  isLoading: boolean;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) return "bg-green-500";
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) return "bg-yellow-500";
  return "bg-red-500";
}

function getConfidenceBadgeColor(confidence: number): string {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
  return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
}

function getProgressColor(confidence: number): string {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) return "bg-green-500";
  if (confidence >= CONFIDENCE_THRESHOLDS.medium) return "bg-yellow-500";
  return "bg-red-500";
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-muted" />
          </div>
          <div className="space-y-2 text-center">
            <div className="h-7 w-40 mx-auto rounded bg-muted" />
            <div className="h-4 w-56 mx-auto rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-4 w-24 mx-auto rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PredictionResult({
  result,
  isLoading,
}: PredictionResultProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </motion.div>
      ) : result ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Top Prediction */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-4xl"
                >
                  {CLASS_INFO[result.topPrediction.className]?.icon || "🔍"}
                </motion.div>

                <div className="space-y-1">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold tracking-tight"
                  >
                    {CLASS_INFO[result.topPrediction.className]?.label ||
                      result.topPrediction.className}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-muted-foreground"
                  >
                    {CLASS_INFO[result.topPrediction.className]
                      ?.description || ""}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Badge
                    className={getConfidenceBadgeColor(
                      result.topPrediction.confidence
                    )}
                  >
                    #1 Prediction
                  </Badge>
                </motion.div>
              </div>

              {/* Confidence Number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center space-y-2"
              >
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
                  className="text-7xl font-black tabular-nums tracking-tight"
                >
                  {(result.topPrediction.confidence * 100).toFixed(1)}%
                </motion.span>

                <Progress
                  value={result.topPrediction.confidence * 100}
                  indicatorClassName={getProgressColor(
                    result.topPrediction.confidence
                  )}
                  className="h-3"
                />
              </motion.div>

              {/* Inference Time */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-muted-foreground"
              >
                Inference: {result.inferenceTimeMs}ms
              </motion.p>

              {/* All Predictions List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-2"
              >
                {result.allPredictions.map((pred, i) => (
                  <motion.div
                    key={pred.className}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center justify-between rounded-lg bg-accent/50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {CLASS_INFO[pred.className]?.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {CLASS_INFO[pred.className]?.label ||
                          pred.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-20 rounded-full bg-secondary overflow-hidden`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getConfidenceColor(
                            pred.confidence
                          )}`}
                          style={{
                            width: `${Math.max(pred.confidence * 100, 2)}%`,
                          }}
                        />
                      </div>
                      <span className="min-w-[3.5rem] text-right text-sm font-medium tabular-nums">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                  <BarChart2 className="h-10 w-10 text-muted-foreground" />
                </div>
              </motion.div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No Results Yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-xs">
                Upload a classroom image and click "Analyze Image" to see
                predictions
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
