# PULSE

A frontend-only livestream browsing platform built with Next.js 14.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Framer Motion 11
- Tailwind CSS 3
- React Icons 5

## Features

- Browse live, upcoming, and ended stream events
- Personalized feed based on selected interests
- Simulated live chat with auto-messages
- YouTube video player integration
- Persistent likes and reminders via localStorage
- Responsive dark glassmorphism UI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is deployed on Vercel. No environment variables are required — it is a fully static frontend with no backend.

## Notes

- All data is hardcoded in `data/events.js`
- User auth is simulated via localStorage
- Chat messages are simulated — no WebSocket server
