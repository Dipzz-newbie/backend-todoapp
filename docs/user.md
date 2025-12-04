# User API

# Before User Login "User Regiser"

## Register API

```http
End Point : POST /api/register
```

Header:

- Content-Type: application/json

Request Body :

```json
{
  "email": "test@example.com",
  "password": "rahasia",
  "name": "Dipz"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "name": "Dipz",
    "email": "test@example.com",
    "avatarUrl": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": null
  }
}
```

Response Error:

```json
{
  "errors": "Email already registered"
}
```

---

## Login API

```http
End Point : POST /api/login
```

Header:

- Content-Type: application/json

Request Body:

```json
{
  "email": "test@example.com",
  "password": "rahasia"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": "uuid",
    "name": "Dipz",
    "email": "test@example.com",
    "avatarUrl": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": null,
    "token": "jwt_access_token",
    "refreshToken": "refresh_token_string"
  }
}
```

Response Error:

```json
{
  "errors": "Password or email is incorrect"
}
```

---

## Refresh Token API

```http
End Point : POST /api/refresh-token
```

Header:

- Authorization: Bearer {Token}

Request Body:

```json
{
  "refreshToken": "your_refresh_token"
}
```

Response Body Success:

```json
{
  "data": {
    "token": "new_access_token",
    "refreshToken": "refresh_token"
  }
}
```

Response Body Error:

```json
{
  "data": {
    "errors": "Refresh token is required"
  }
}
```

# After User Login "User Profile"

## Get User Profile

```http
End Point : GET /api/users/current
```

Header:

- Authorization: Bearer {Token}

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "name": "Dipz",
    "email": "test@example.com",
    "avatarUrl": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": null
  }
}
```

Response Error:

```json
{
  "errors": "Unauthorized"
}
```

---

## Update User Profile

```http
End Point : PATCH /api/users/current
```

Header:

- Authorization: Bearer <token>
- Content-Type: application/json

Request Body (one or both fields allowed):

```json
{
  "name": "New Name",
  "password": "newPassword",
  "avatarUrl": "https://example.com/avatar.png"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "name": "New Name",
    "email": "test@example.com",
    "avatarUrl": "https://example.com/avatar.png",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z"
  }
}
```

Response Error:

```json
{
  "errors": "Unauthorized"
}
```

## Logout User

```http
End Point : POST /api/users/logout
```

Header:

- Authorization: Bearer {Token}

Request Body:

```json
{
  "refreshToken": "refresh_token"
}
```

Response Body Success:

```json
{
  "data": {
    "message": "Logout successfully"
  }
}
```

Response Body Error:

```json
{
  "errors": "Invalid or expired refresh token"
}
```

---
