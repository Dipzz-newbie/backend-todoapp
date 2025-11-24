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
  {
  "id":"<id:uuid>",
  "name":"test",
  "email":"test@example.com",
  "avatarUrl":null,
  "createdAt":"2025-11-24T12:15:17.689Z",
  "updateAt":"2025-11-24T12:15:17.689Z"
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
    "id": "<id:uuid>",
    "name": "test",
    "email": "test@example.com",
    "avatarUrl": null,
    "refreshToken": "<token:uuid>",
    "token": "<token:uuid>",
    "updateAt": "2025-11-24T12:20:12.688Z"
  },
  "createdAt": "2025-11-24T12:20:12.688Z"
}
```

Response Error:

```json
{
  "errors": "Password or email is incorrect"
}
```

---

#### Refresh Token API

```http
End Point : POST /api/users/current
```

Header:

- Authorization: Bearer {Token}

Request Body:

```json
{
  "data": {
    "refershToken": "<token:uuid>",
    "token": "<token:uuid>"
  }
}
```

Response Body Success:

```json
{
  "data": {
    "refershToken": "<token:uuid>",
    "token": "<token:uuid>"
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
    "id": "<id:uuid>",
    "email": "test@example.com",
    "name": "test",
    "avatarUrl": null,
    "createdAt": "2025-11-24T13:21:26.759Z",
    "updateAt": "2025-11-24T13:21:26.759Z"
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
  "password": "new password",
  "name": "test",
  "avatarUrl": "http://example.com/avatar.png"
}
```

Response Body Success:

```json
{
  "data": {
    "data":{
      "id":"<id:uuid>",
      "email":"test@example.com",
      "name":"test",
      "avatarUrl":"http://example.com/avatar.png",
      "createdAt":"2025-11-24T13:25:15.675Z",
      "updateAt":"2025-11-24T13:25:16.050Z"}
  }
}
```

Response Error:

```json
{
  "errors": "Unauthorized"
}
```

#### Logout User 

```http
End Point : POST /api/users/logout
```

Header:

- Authorization: Bearer {Token}

Request Body:

```json
{
  "data": {
    "refershToken": "<token:uuid>",
  }
}
```

Response Body Success:

```json
{
  "data": {
    "refershToken": "<token:uuid>",
    "token": "<token:uuid>"
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


---
