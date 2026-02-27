# API Documentation

Base URL: `http://localhost:3000`

All routes are mounted in `app.js`.

## Health Check

### GET `/`

Returns a simple server response.

#### Success Response

**Status Code:** `200 OK`

```json
"hjey"
```

---

## User Routes

## User Registration Endpoint

### POST `/users/register`

Registers a new user in the system.

### Request Body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

### Field Requirements

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) |
| `email` | String | Yes | Must be a valid email format |
| `password` | String | Yes | Minimum 6 characters |

### Response

#### Success Response

**Status Code:** `201 Created`

```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  }
}
```

#### Error Response - Validation Failed

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

#### Error Response - User Already Exists

**Status Code:** `400 Bad Request`

```json
{
  "message": "User Already exists!"
}
```

---

## User Login Endpoint

### POST `/users/login`

Authenticates an existing user and returns a JWT token.

### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Field Requirements

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `email` | String | Yes | Must be a valid email format |
| `password` | String | Yes | Minimum 6 characters |

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  }
}
```

#### Error Response - Validation Failed

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

#### Error Response - User Not Found

**Status Code:** `401 Unauthorized`

```json
"Invalid email or password!"
```

#### Error Response - Wrong Password

**Status Code:** `401 Unauthorized`

```json
"Wrong password!"
```

---

## User Profile Endpoint

### GET `/users/profile`

Retrieves the authenticated user's profile.

### Authentication

Requires JWT in one of:
- Cookie: `token`
- Authorization header: `Bearer <token>`

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string"
}
```

#### Error Response - Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized!"
}
```

---

## User Logout Endpoint

### GET `/users/logout`

Logs out the user by clearing cookie and blacklisting the current token.

### Notes

- This route is currently not protected by middleware.
- For blacklist behavior, send token via cookie or Authorization header.

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logged Out"
}
```

---

## Captain Routes

## Captain Registration Endpoint

### POST `/captains/register`

Registers a new captain with vehicle details.

### Request Body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Field Requirements

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) |
| `email` | String | Yes | Must be valid email |
| `password` | String | Yes | Minimum 6 characters |
| `vehicle.color` | String | Yes | Minimum 3 characters |
| `vehicle.plate` | String | Yes | Minimum 3 characters |
| `vehicle.capacity` | Number | Yes | Integer, minimum 1 |
| `vehicle.vehicleType` | String | Yes | One of `car`, `motorcycle`, `auto` |

### Response

#### Success Response

**Status Code:** `201 Created`

```json
{
  "token": "JWT_TOKEN_STRING",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "active"
  }
}
```

#### Error Response - Validation Failed

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

#### Error Response - Duplicate Captain

**Status Code:** `400 Bad Request`

```json
{
  "message": "Captain ALready Exists!"
}
```

#### Error Response - Duplicate Vehicle Plate

**Status Code:** `400 Bad Request`

```json
{
  "message": "Vehicle with this plate number is already registered!"
}
```

---

## Captain Login Endpoint

### POST `/captains/login`

Authenticates an existing captain and returns a JWT token.

### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "token": "JWT_TOKEN_STRING",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Error Response

**Status Code:** `400 Bad Request`

```json
{
  "message": "Invalid email or password"
}
```

---

## Captain Profile Endpoint

### GET `/captains/profile`

Retrieves authenticated captain profile.

### Authentication

Requires JWT in one of:
- Cookie: `token`
- Authorization header: `Bearer <token>`

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Error Response - Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized!"
}
```

---

## Captain Logout Endpoint

### GET `/captains/logout`

Logs out authenticated captain and blacklists token.

### Authentication

Requires JWT in one of:
- Cookie: `token`
- Authorization header: `Bearer <token>`

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logout Succesfully!"
}
```

---

## Maps Routes

## Get Coordinates

### GET `/maps/get-coordinates`

Returns latitude/longitude for a given address.

### Authentication

Requires user JWT (same rules as `/users/profile`).

### Query Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `address` | Yes | Full address text |

### Success Response

**Status Code:** `200 OK`

```json
{
  "ltd": 28.6139,
  "lng": 77.209
}
```

### Error Response

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Address is required",
      "param": "address",
      "location": "query"
    }
  ]
}
```

or

```json
{
  "message": "Co-ordinate not found"
}
```

---

## Get Distance and Time

### GET `/maps/get-distance-time`

Returns trip distance (meters) and duration (seconds).

### Authentication

Requires user JWT.

### Query Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `origin` | Yes | Starting address |
| `destination` | Yes | Destination address |

### Success Response

**Status Code:** `200 OK`

```json
{
  "distance": 12345,
  "duration": 1800
}
```

### Error Response

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Origin is required",
      "param": "origin",
      "location": "query"
    }
  ]
}
```

or

```json
{
  "message": "Error fetching distance and time"
}
```

---

## Get Place Suggestions

### GET `/maps/get-suggestions`

Returns Google Places autocomplete suggestions for input text.

### Authentication

Requires user JWT.

### Query Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `input` | Yes | Partial place text |

### Success Response

**Status Code:** `200 OK`

```json
[
  {
    "description": "Connaught Place, New Delhi, India",
    "place_id": "..."
  }
]
```

### Error Response

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Input is required",
      "param": "input",
      "location": "query"
    }
  ]
}
```

or

```json
{
  "message": "Error fetching autocomplete suggestions"
}
```

---

## Ride Routes

## Create Ride

### POST `/rides/create`

Creates a new ride request for an authenticated user.

### Authentication

Requires user JWT.

### Request Body

```json
{
  "pickup": "Rajiv Chowk, New Delhi",
  "destination": "Noida Sector 18",
  "vehicleType": "car"
}
```

### Field Requirements

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `pickup` | String | Yes | Non-empty string |
| `destination` | String | Yes | Non-empty string |
| `vehicleType` | String | Yes | One of `bike`, `auto`, `car` |

### Success Response

**Status Code:** `201 Created`

```json
{
  "UserId": "user_id",
  "pickup": "Rajiv Chowk, New Delhi",
  "destination": "Noida Sector 18",
  "status": "pending",
  "fare": 230,
  "_id": "ride_id",
  "createdAt": "2026-02-25T10:00:00.000Z",
  "updatedAt": "2026-02-25T10:00:00.000Z",
  "__v": 0
}
```

> Note: `otp` is generated internally but excluded from default response (`select: false`).

### Error Response - Validation Failed

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Vehicle type must be one of bike, auto, or car",
      "param": "vehicleType",
      "location": "body"
    }
  ]
}
```

### Error Response - Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Error message"
}
```

---

## Common Authentication Behavior

For protected routes, middleware checks:
1. token from cookie `token` or header `Authorization: Bearer <token>`
2. token is not blacklisted
3. token is valid JWT and maps to an existing user/captain

Typical unauthorized response:

```json
{
  "message": "Unauthorized!"
}
```

In blacklisted-token cases, response message may be:

```json
{
  "message": "Unauthorized"
}
```
