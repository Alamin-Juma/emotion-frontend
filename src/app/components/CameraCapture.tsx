"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface CameraCaptureProps {
  onEmotionDetected: (emotion: string, confidence: number) => void;
  disabled?: boolean;
}

const API_BASE_URL = "https://024ee0f6b887.ngrok-free.app";

export default function CameraCapture({ onEmotionDetected, disabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<{ emotion: string; confidence: number } | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDetectedEmotion(null);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsStreaming(true);
          }).catch((e) => {
            console.error("Video play error:", e);
            setError("Failed to start video preview.");
          });
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please allow camera in browser settings.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found.");
        } else {
          setError("Failed to access camera: " + err.message);
        }
      }
    }
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    setError(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 (remove data:image/jpeg;base64, prefix)
      const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];

      const response = await fetch(`${API_BASE_URL}/api/emotion/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();

      if (data.success && data.faces_detected > 0) {
        const emotion = data.primary_emotion;
        const confidence = data.predictions[0].confidence;
        setDetectedEmotion({ emotion, confidence });
        onEmotionDetected(emotion, confidence);
      } else if (data.faces_detected === 0) {
        setError("No face detected. Please face the camera and try again.");
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (e) {
      console.error("Capture error:", e);
      setError("Failed to connect to server. Is the API running?");
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onEmotionDetected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const emojiMap: Record<string, string> = {
    happy: "😊", sad: "😢", angry: "😠", fear: "😰",
    surprise: "😲", disgust: "🤢", neutral: "😐",
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Video Area */}
      <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
        {/* Always render video element, hide when not streaming */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isStreaming ? "block" : "hidden"}`}
        />

        {/* Show placeholder when not streaming */}
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm mb-4">Let AI detect your mood from your expression</p>
              <button
                onClick={startCamera}
                disabled={disabled}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Enable Camera
              </button>
            </div>
          </div>
        )}

        {/* Face guide overlay - only show when streaming */}
        {isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-52 border-2 border-dashed border-white/40 rounded-full" />
          </div>
        )}

        {/* Capturing overlay */}
        {isCapturing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Analyzing your expression...</p>
            </div>
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Detection result */}
        {detectedEmotion && !error && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center gap-3">
            <span className="text-3xl">{emojiMap[detectedEmotion.emotion] || "🎭"}</span>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300 capitalize">
                {detectedEmotion.emotion}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {(detectedEmotion.confidence * 100).toFixed(0)}% confidence
              </p>
            </div>
          </div>
        )}

        {/* Action buttons - only show when camera is streaming */}
        {isStreaming && (
          <div className="flex gap-2">
            <button
              onClick={captureAndAnalyze}
              disabled={isCapturing || disabled}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isCapturing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capture & Detect Mood
                </>
              )}
            </button>
            <button
              onClick={stopCamera}
              className="px-3 py-2.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              title="Stop camera"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Helper text */}
        <p className="text-center text-xs text-zinc-500">
          {isStreaming
            ? "Position your face in the oval and click capture"
            : "Camera feed stays on your device until you capture"}
        </p>
      </div>
    </div>
  );
}
