"use client";

import { useState } from "react";
import MoodSelector from "./components/MoodSelector";
import TrackCard from "./components/TrackCard";
import CameraCapture from "./components/CameraCapture";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  url: string;
  uri: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [mode, setMode] = useState<"select" | "camera">("select");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [detectedConfidence, setDetectedConfidence] = useState<number | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(false);

  const fetchRecommendations = async (mood: string) => {
    setLoading(true);
    setError(null);
    setSelectedMood(mood);

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion: mood }),
      });

      const data = await response.json();

      if (data.success) {
        setTracks(data.tracks);
        setMockMode(data.mock_mode);
      } else {
        setError(data.error || "Failed to get recommendations");
        setTracks([]);
      }
    } catch {
      setError("Failed to connect to server. Make sure the API is running.");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setDetectedConfidence(null);
    fetchRecommendations(mood);
  };

  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setDetectedConfidence(confidence);
    fetchRecommendations(emotion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Mood Music</h1>
                <p className="text-xs text-zinc-500">AI Emotion Recommender</p>
              </div>
            </div>
            {mockMode && (
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                Demo Mode
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            How are you feeling?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Get personalized music for your mood
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setMode("select")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "select"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Select Mood
            </button>
            <button
              onClick={() => setMode("camera")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                mode === "camera"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Camera
            </button>
          </div>
        </div>

        {/* Content based on mode */}
        {mode === "select" ? (
          <section className="mb-10">
            <MoodSelector
              selectedMood={selectedMood}
              onSelect={handleMoodSelect}
              disabled={loading}
            />
          </section>
        ) : (
          <section className="mb-10 max-w-xl mx-auto">
            <CameraCapture
              onEmotionDetected={handleEmotionDetected}
              disabled={loading}
            />
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-12">
            <div className="w-12 h-12 border-4 border-green-200 dark:border-green-900 border-t-green-500 rounded-full animate-spin" />
            <p className="mt-4 text-zinc-500">Finding tracks for your mood...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 text-center">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => selectedMood && fetchRecommendations(selectedMood)}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && tracks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Your {selectedMood?.charAt(0).toUpperCase()}{selectedMood?.slice(1)} Playlist
                </h3>
                <p className="text-sm text-zinc-500">
                  {tracks.length} tracks
                  {detectedConfidence && ` (detected ${(detectedConfidence * 100).toFixed(0)}% confidence)`}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              {tracks.map((track, index) => (
                <TrackCard key={track.id} track={track} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading && !error && tracks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-zinc-500">
              {mode === "select" ? "Select a mood to get started" : "Use the camera to detect your mood"}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-zinc-500">
          Powered by AI Emotion Detection
        </div>
      </footer>
    </div>
  );
}
