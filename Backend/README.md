# API Documentation

## User Registration Endpoint

### POST `/users/register`

Registers a new user in the system with email and password authentication.

---

### Request Body

The endpoint expects a JSON object with the following structure:

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

---

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

#### Error Response

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

---

### Status Codes

| Status Code | Description |
|-------------|-------------|
| `201` | User successfully created and registered |
| `400` | Validation error - Invalid or missing required fields |
| `500` | Internal server error |

---

### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

### Example Success Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Example Error Response

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name should be minimum of 3 characters",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

---

### Notes

- The password is automatically hashed using bcrypt before storage
- A JWT token is generated and returned upon successful registration
- The email must be unique in the system
- The token should be stored by the client for subsequent authenticated requests

---

## User Login Endpoint

### POST `/users/login`

Authenticates an existing user and returns a JWT token for subsequent requests.

---

### Request Body

The endpoint expects a JSON object with the following structure:

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

---

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

#### Error Response - Invalid Credentials

**Status Code:** `401 Unauthorized`

```json
"Invalid email or password!"
```

or

```json
"Wrong password!"
```

---

### Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | User successfully authenticated |
| `400` | Validation error - Invalid or missing required fields |
| `401` | Unauthorized - Invalid email or incorrect password |
| `500` | Internal server error |

---

### Example Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

### Example Success Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Example Error Response - Invalid Email

```json
{
  "errors": [
    {
      "msg": "Invalid Email!",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Example Error Response - User Not Found

```json
"Invalid email or password!"
```

### Example Error Response - Wrong Password

```json
"Wrong password!"
```

---

### Notes

- The password is verified using bcrypt comparison
- A JWT token is generated and returned upon successful login
- The user credentials must match exactly with stored records
- The token should be included in the Authorization header for subsequent authenticated requests
- Tokens are valid based on the JWT_SECRET environment variable

---

## User Profile Endpoint

### GET `/users/profile`

Retrieves the authenticated user's profile information.

---

### Authentication Required

This endpoint requires a valid JWT token in either:
- Cookie: `token`
- Authorization header: `Bearer <token>`

---

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
```

or send the token via cookie from login response.

---

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
  "message": "Unauthorized"
}
```

---

### Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Profile retrieved successfully |
| `401` | Unauthorized - Invalid or missing token |
| `500` | Internal server error |

---

### Example Request

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example Success Response

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

---

### Notes

- This endpoint requires authentication via JWT token
- Returns the user data from the decoded token
- Password is never included in the response

---

## User Logout Endpoint

### GET `/users/logout`

Logs out the authenticated user by invalidating the JWT token.

---

### Authentication Required

This endpoint requires a valid JWT token in either:
- Cookie: `token`
- Authorization header: `Bearer <token>`

---

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
```

or send the token via cookie from login response.

---

### Response

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logged Out"
}
```

#### Error Response - Unauthorized

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized"
}
```

---

### Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | User logged out successfully |
| `401` | Unauthorized - Invalid or missing token |
| `500` | Internal server error |

---

### Example Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example Success Response

```json
{
  "message": "Logged Out"
}
```

---

### Notes

- This endpoint requires authentication via JWT token
- Clears the authentication cookie from the client
- Adds the token to a blacklist to prevent reuse
- Once logged out, the token cannot be used for subsequent requests
- Client should discard the token after receiving the success response

---

## Captain Registration Endpoint

### POST `/captains/register`

Registers a new captain in the system with vehicle details and authentication.

---

### Request Body

The endpoint expects a JSON object with the following structure:

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
    "capacity": "number",
    "vehicleType": "string"
  }
}
```

### Field Requirements

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `fullname.firstname` | String | Yes | Minimum 3 characters |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) |
| `email` | String | Yes | Must be a valid email format |
| `password` | String | Yes | Minimum 6 characters |
| `vehicle.color` | String | Yes | Minimum 3 characters |
| `vehicle.plate` | String | Yes | Minimum 3 characters |
| `vehicle.capacity` | Number | Yes | Minimum value of 1 |
| `vehicle.vehicleType` | String | Yes | Must be one of: 'car', 'motorcycle', 'auto' |

---

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
      "capacity": "number",
      "vehicleType": "string"
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

#### Error Response - Captain Already Exists

**Status Code:** `400 Bad Request`

```json
{
  "message": "Captain ALready Exists!"
}
```

---

### Status Codes

| Status Code | Description |
|-------------|-------------|
| `201` | Captain successfully created and registered |
| `400` | Validation error or captain already exists |
| `500` | Internal server error |

---

### Example Request

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "password": "securePassword123",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

### Example Success Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "active"
  }
}
```

### Example Error Response - Validation

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Invalid vehicle type",
      "param": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

### Example Error Response - Duplicate Captain

```json
{
  "message": "Captain ALready Exists!"
}
```

---

### Notes

- The password is automatically hashed using bcrypt before storage
- A JWT token is generated and returned upon successful registration
- The email and vehicle plate must be unique in the system
- Vehicle type must be one of: 'car', 'motorcycle', or 'auto'
- Captain status is set to 'active' by default
- The token should be stored by the client for subsequent authenticated requests

