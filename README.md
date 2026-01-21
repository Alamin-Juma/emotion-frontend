# Emotion Music Recommender - Frontend

A Next.js frontend for the AI-powered Emotion Music Recommender. Get personalized Spotify music recommendations based on your mood - either by selecting a mood manually or using AI facial emotion detection.

## Features

- 🎭 **Mood Selection** - Choose from 8 different moods to get music recommendations
- 📷 **Camera Emotion Detection** - Let AI detect your mood from your facial expression
- 🎵 **Spotify Integration** - Get real music recommendations from Spotify
- 🌓 **Dark Mode** - Automatic dark/light mode based on system preference
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **AWS Amplify** - Hosting and deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see [AI-ML-SOLUTION](https://github.com/Alamin-Juma/Emotion-Aware-Music-Recommender))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Alamin-Juma/emotion-frontend.git
cd emotion-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app is configured for AWS Amplify deployment. The `amplify.yml` file contains the build configuration.

### Environment Variables for Amplify

Set these in the Amplify Console:
- `NEXT_PUBLIC_API_URL` - Your backend API URL

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── CameraCapture.tsx   # Facial emotion detection
│   │   ├── MoodSelector.tsx    # Manual mood selection grid
│   │   └── TrackCard.tsx       # Spotify track display
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
```

## API Endpoints Used

- `POST /api/recommendations` - Get music recommendations for a mood
- `POST /api/emotion/image` - Analyze facial expression from image

## License

MIT
