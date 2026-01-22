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
