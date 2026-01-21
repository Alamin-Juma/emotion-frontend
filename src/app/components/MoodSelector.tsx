"use client";

interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const moods: Mood[] = [
  { id: "happy", label: "Happy", emoji: "😊", color: "text-yellow-600", bgColor: "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50" },
  { id: "sad", label: "Sad", emoji: "😢", color: "text-blue-600", bgColor: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50" },
  { id: "energetic", label: "Energetic", emoji: "⚡", color: "text-orange-600", bgColor: "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50" },
  { id: "calm", label: "Calm", emoji: "🧘", color: "text-green-600", bgColor: "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50" },
  { id: "angry", label: "Angry", emoji: "😠", color: "text-red-600", bgColor: "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50" },
  { id: "fear", label: "Anxious", emoji: "😰", color: "text-purple-600", bgColor: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50" },
  { id: "surprise", label: "Excited", emoji: "🤩", color: "text-pink-600", bgColor: "bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-900/50" },
  { id: "neutral", label: "Neutral", emoji: "😐", color: "text-gray-600", bgColor: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-800/70" },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelect: (mood: string) => void;
  disabled?: boolean;
}

export default function MoodSelector({ selectedMood, onSelect, disabled }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onSelect(mood.id)}
          disabled={disabled}
          className={`
            relative p-6 rounded-2xl transition-all duration-300 transform
            ${mood.bgColor}
            ${selectedMood === mood.id
              ? "ring-2 ring-offset-2 ring-offset-background ring-current scale-105 shadow-lg"
              : "hover:scale-102 shadow-md hover:shadow-lg"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{mood.emoji}</span>
            <span className={`font-semibold ${mood.color}`}>{mood.label}</span>
          </div>
          {selectedMood === mood.id && (
            <div className="absolute top-2 right-2">
              <svg className={`w-5 h-5 ${mood.color}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
