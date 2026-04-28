# RideX Frontend

Frontend client for RideX, a ride-hailing application where users can book rides and captains can accept, start, and complete trips in real time.

## Tech Stack

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?logo=tailwind-css)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-010101?logo=socket.io)
![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?logo=greensock)
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?logo=googlemaps)

## Key Features

- User and captain authentication flows
- Ride booking and fare estimation
- Captain ride acceptance and ride lifecycle flow
- Realtime updates via Socket.io
- Location suggestions and route-based ride details

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the `frontend` folder:

```env
VITE_BASE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173` by default.

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## Backend Requirement

This frontend expects the backend server to be running and reachable at `VITE_BASE_URL`.

Default backend URL during local development:

`http://localhost:3000`

## Author

Alok Kumar  
GitHub: https://github.com/alok-kumar2505
