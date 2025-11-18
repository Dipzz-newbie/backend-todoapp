## API SPEC

### Auth API

#### Register API

```http
End Point : POST /api/register
```

Header:

- Content-Type: application/json

Request Body :

```json
{
  "email": "user@example.com",
  "password": "test",
  "name": "User Nama"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Nama",
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

#### Login API

```http
End Point : POST /api/login
```

Header:

- Content-Type: application/json

Request Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response Body (Success):

```json
{
  "data": {
    "email": "user@example.com",
    "password": "password123",
    "token": "random-token",
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

### User Profile

#### Get User Profile

```http
End Point : GET /api/users/current
```

Header:

- Authorization: Bearer {Token}

Response Body Success:

```json
{
  "data": {
    "id": "random-uuid",
    "email": "test@example.com",
    "name": "test",
    "avatarUrl": null,
    "createdAt": "10-2-2025",
    "updateAt": "10-2-2025"
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

#### Update User Profile

```http
End Point : PATCH /api/users/current
```

Header:

- Authorization: Bearer <token>
- Content-Type: application/json

Request Body (one or both fields allowed):

```json
{
  "Name": "Nama Baru",
  "avatarUrl": "https://imageurl.com"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nama Baru",
    "avatarUrl": "https://imageurl.com"
  }
}
```

Response Error:

```json
{
  "errors": "User not found"
}
```

---
