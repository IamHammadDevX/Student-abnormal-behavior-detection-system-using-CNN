"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Brain, BarChart3, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import PredictionResult from "@/components/PredictionResult";
import ConfidenceChart from "@/components/ConfidenceChart";
import { useModel } from "@/hooks/useModel";
import { useInference } from "@/hooks/useInference";
import type { InferenceResult } from "@/types";

export default function Home() {
  const {
    status: modelStatus,
    error: modelError,
    loadProgress,
    model,
  } = useModel();
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { runInference } = useInference(model);

  const handleImageSelected = useCallback(
    (_file: File, img: HTMLImageElement) => {
      setImageElement(img);
      setResult(null);
    },
    []
  );

  const handleAnalyze = useCallback(async () => {
    if (!imageElement) return;

    setIsAnalyzing(true);
    try {
      const inferenceResult = await runInference(imageElement);
      setResult(inferenceResult);
    } catch {
      // error handled inside hook
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageElement, runInference]);

  const steps = [
    {
      icon: Upload,
      title: "Upload Image",
      desc: "Take or upload a classroom photo",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      desc: "Model analyzes student behavior",
    },
    {
      icon: BarChart3,
      title: "View Results",
      desc: "See confidence scores for each class",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="container px-4 py-8 md:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Classroom Behavior Analysis
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Upload a classroom image to detect and analyze student behaviors
            using our deep learning model
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <ImageUploader
              onImageSelected={handleImageSelected}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              modelStatus={modelStatus}
              loadProgress={loadProgress}
              modelError={modelError}
              hasResult={result !== null}
            />

            {/* Inference time */}
            {result && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-muted-foreground"
              >
                Inference completed in{" "}
                <span className="font-medium text-foreground">
                  {result.inferenceTimeMs}ms
                </span>
              </motion.p>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <PredictionResult
              result={result}
              isLoading={isAnalyzing}
            />

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ConfidenceChart predictions={result.allPredictions} />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 md:mt-24"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold">How It Works</h3>
            <p className="mt-1 text-muted-foreground">
              Three simple steps to get insights
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="relative flex flex-col items-center rounded-2xl border bg-card p-8 text-center shadow-sm"
              >
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground mb-3">
                  {i + 1}
                </div>
                <h4 className="text-lg font-semibold">{step.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 md:mt-24">
        <div className="container px-4 py-6 text-center text-sm text-muted-foreground">
          Classroom Monitor &mdash; AI-Powered Behavior Detection System
        </div>
      </footer>
    </div>
  );
}
