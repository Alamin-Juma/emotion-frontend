"use client";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  url: string;
  uri: string;
}

interface TrackCardProps {
  track: Track;
  index: number;
}

export default function TrackCard({ track, index }: TrackCardProps) {
  const isSpotifyUrl = track.url && track.url.includes("spotify.com");

  return (
    <div
      className="group relative bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Track Number / Play Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
          {index + 1}
        </div>

        {/* Track Info */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {track.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
            {track.artist}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
            {track.album}
          </p>
        </div>

        {/* Play Button */}
        {isSpotifyUrl ? (
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-3 bg-green-500 hover:bg-green-600 rounded-full text-white transition-all duration-200 transform hover:scale-110 shadow-md"
            title="Open in Spotify"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
        ) : (
          <div className="flex-shrink-0 p-3 bg-zinc-200 dark:bg-zinc-700 rounded-full text-zinc-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
