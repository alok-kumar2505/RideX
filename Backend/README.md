# RideX Backend

Backend API for RideX ride-hailing platform built with Node.js, Express, MongoDB, and Socket.io.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?logo=socket.io)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?logo=googlemaps)

## Project Structure

```text
Backend/
├── controllers/
├── db/
├── Middleware/
├── models/
├── routes/
├── services/
├── app.js
├── server.js
└── socket.js
```

## Environment Variables

Create a `.env` file inside `Backend/`:

```env
PORT=3000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API=your_google_maps_api_key
```

## Installation and Run

```bash
cd Backend
npm install
node server.js
```

Base URL: `http://localhost:3000`

## API Routes

### User Routes

- `POST /users/register`
- `POST /users/login`
- `GET /users/profile` (protected)
- `GET /users/logout`

### Captain Routes

- `POST /captains/register`
- `POST /captains/login`
- `GET /captains/profile` (protected)
- `GET /captains/logout` (protected)

### Maps Routes

- `GET /maps/get-coordinates` (protected user route)
- `GET /maps/get-distance-time` (protected user route)
- `GET /maps/get-suggestions` (protected user route)

### Ride Routes

- `POST /rides/create` (protected user route)
- `GET /rides/get-fare` (protected user route)
- `POST /rides/confirm` (protected captain route)
- `GET /rides/start-ride` (protected captain route)
- `POST /rides/end-ride` (protected captain route)

## Realtime Events (Socket.io)

### Client -> Server

- `join`
- `update-location-captain`

### Server -> Client

- `new-ride`
- `ride-confirmed`
- `ride-started`
- `ride-ended`

## Auth Notes

Protected APIs accept token via:

- Cookie: `token`
- Header: `Authorization: Bearer <token>`

Blacklisted tokens are rejected.

## Author

Alok Kumar  
GitHub: https://github.com/alok-kumar2505

- `origin` (required)
- `destination` (required)

Success `200`:

```json
{
  "distance": 12345,
  "duration": 1800
}
```

Errors:

- `400` validation errors
- `400` `{ "error": "Origin and destination query parameters are required" }`
- `400` `{ "message": "Error fetching distance and time" }`

### GET `/maps/get-suggestions`

Query:

- `input` (required)

Success `200`:

```json
[
  {
    "description": "Connaught Place, New Delhi, India",
    "place_id": "..."
  }
]
```

Errors:

- `400` validation errors
- `400` `{ "message": "Error fetching autocomplete suggestions" }`

## Rides

### POST `/rides/create`

Protected (`authUser`).

Request body:

```json
{
  "pickup": "Rajiv Chowk, New Delhi",
  "destination": "Noida Sector 18",
  "vehicleType": "car"
}
```

Validation:

- `pickup`: non-empty string
- `destination`: non-empty string
- `vehicleType`: one of `bike | auto | car`

Success `201`: created ride object (OTP omitted in normal selection behavior).

Errors:

- `400` validation errors
- `500` `{ "error": "..." }`

Socket side effect:

- Emits `new-ride` to nearby captains.

### GET `/rides/get-fare`

Protected (`authUser`).

Query:

- `pickup` (required)
- `destination` (required)

Success `200`:

```json
{
  "fare": {
    "bike": 120,
    "auto": 160,
    "car": 220
  }
}
```

Errors:

- `400` validation errors
- `400` `{ "error": "Pickup and destination are required" }`
- `500` `{ "error": "..." }`

### POST `/rides/confirm`

Protected (`authCaptain`).

Request body:

```json
{
  "rideId": "RIDE_OBJECT_ID"
}
```

Success `200`: updated ride (`status: accepted`, with populated user/captain).

Errors:

- `400` validation errors
- `500` `{ "error": "..." }`

Socket side effect:

- Emits `ride-confirmed` to user socket.

### GET `/rides/start-ride`

Protected (`authCaptain`).

Query params:

- `rideId` (required)
- `otp` (required, 6 chars)

Success `200`: ride object.

Errors:

- `400` validation errors
- `500` `{ "error": "Invalid OTP" | "Ride not found" | ... }`

Socket side effect:

- Emits `ride-started` to user socket.

### POST `/rides/end-ride`

Protected (`authCaptain`).

Request body:

```json
{
  "rideId": "RIDE_OBJECT_ID"
}
```

Validation:

- `rideId`: required and Mongo ObjectId

Success `200`: ride object.

Errors:

- `400` validation errors
- `500` `{ "error": "Ride not found" | "Ride is not ongoing" | ... }`

Socket side effect:

- Emits `ride-ended` to user socket.

## Realtime Socket Events

Socket server starts in `server.js` via `initializeSocket(server)`.

### Client -> Server

- `join`
  - payload: `{ userId, userType }`
  - behavior: stores socketId on user/captain document

- `update-location-captain`
  - payload: `{ userId, location: { ltd, lng } }`
  - behavior: updates captain location in DB

### Server -> Client (used by ride flow)

- `new-ride`
- `ride-confirmed`
- `ride-started`
- `ride-ended`

These are emitted via `sendMessageToSocketId(socketId, { event, data })`.

## Notes

- CORS is enabled with `app.use(cors())`.
- JSON/body parsing and cookies are enabled.
- Routes mounted in `app.js`:
  - `/users`
  - `/captains`
  - `/maps`
  - `/rides`
