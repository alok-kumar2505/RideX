# RideX 🚖

RideX is a full-stack ride-hailing web application built to connect riders and captains (drivers) in real time. It includes secure authentication, live ride updates, map-based location services, and a complete ride lifecycle from booking to trip completion.

## 🚀 Tech Stack

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-010101?logo=socket.io)
![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?logo=greensock)
![Google%20Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?logo=googlemaps)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)

## 🚀 Features

### Rider (User)
- JWT-based registration and login
- Search pickup and destination with location suggestions
- Choose vehicle type and book a ride
- Get fare estimates before confirming
- Receive live ride status updates

### Captain (Driver)
- Captain registration and login with vehicle details
- Receive nearby ride requests
- Confirm, start (OTP flow), and finish rides
- Share live location updates during active rides

### Realtime + Maps
- Socket.io based live communication
- Google Maps powered geocoding and suggestions
- Distance and time estimation for ride pricing



### Stack Details

### Frontend
- React (Vite)
- Tailwind CSS
- GSAP
- React Router
- Context API
- Socket.io Client
- `@react-google-maps/api`

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcrypt
- Socket.io
- Axios
- express-validator

## 📂 Project Structure

```text
RideX/
├── Backend/
│   ├── controllers/
│   ├── db/
│   ├── Middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   └── socket.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    └── package.json
```

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Google Maps API key

### 2. Clone the Repository

```bash
git clone https://github.com/alok-kumar2505/RideX.git
cd RideX
```

### 3. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
PORT=3000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API=your_google_maps_api_key
```

Start backend server:

```bash
node server.js
```

### 4. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## 📡 API Overview

Base URL: `http://localhost:3000`

### User Routes
- `POST /users/register`
- `POST /users/login`
- `GET /users/profile`
- `GET /users/logout`

### Captain Routes
- `POST /captains/register`
- `POST /captains/login`
- `GET /captains/profile`
- `GET /captains/logout`

### Maps Routes
- `GET /maps/get-coordinates`
- `GET /maps/get-distance-time`
- `GET /maps/get-suggestions`

### Ride Routes
- `POST /rides/create`
- `GET /rides/get-fare`
- `POST /rides/confirm`
- `GET /rides/start-ride`
- `POST /rides/end-ride`

## 🔌 Socket Events

### Client -> Server
- `join`
- `update-location-captain`

### Server -> Client
- `new-ride`
- `ride-confirmed`
- `ride-started`
- `ride-ended`

## 👤 Author

Alok Kumar  
GitHub: https://github.com/alok-kumar2505

## 📄 License

This project is licensed under the ISC License.
