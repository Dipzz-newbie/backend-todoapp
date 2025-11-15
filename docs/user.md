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
  "displayName": "User Nama"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Nama",
    "avatarUrl": null
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
    "token": "jwt-token-string",
  }
}
```

Response Error:

```json
{
  "errors": "Invalid email or password"
}
```

---

### User Profile

#### Get User Profile

```http
End Point : GET /api/users/me
```
Header:

- Authorization: Bearer <token>

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "User Nama",
    "avatarUrl": null
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

#### Update User Profile

```http
End Point : PUT /api/users/me
```
Header:

- Authorization: Bearer <token>
- Content-Type: application/json

Request Body (one or both fields allowed):

```json
{
  "displayName": "Nama Baru",
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