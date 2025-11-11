### Task API

#### Create Task

```http
End Point : POST /api/tasks
```

Header:

- Authorization: Bearer <token>
- Content-Type: application/json

Request Body:

```json
{
  "text": "Belajar Next.js",
  "category": "Belajar"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "text": "Belajar Next.js",
    "completed": false,
    "category": "Belajar",
    "createdAt": "2025-11-11T13:20:00.000Z",
    "updatedAt": "2025-11-11T13:20:00.000Z"
  }
}
```

Response Error:

```json
{
  "errors": "Text is required"
}
```

---

#### Update Task

```http
End Point : PUT /api/tasks/:taskId
```

Header:

- Authorization: Bearer <token>
- Content-Type: application/json

Request Body:

```json
{
  "text": "Belajar Prisma",
  "completed": true,
  "category": "Belajar"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "text": "Belajar Prisma",
    "completed": true,
    "category": "Belajar",
    "createdAt": "2025-11-11T13:20:00.000Z",
    "updatedAt": "2025-11-11T13:30:00.000Z"
  }
}
```

Response Error:

```json
{
  "errors": "Task not found"
}
```

---

#### Get Task by id

```http
End Point : GET /api/tasks/:taskId
```

Header:

- Authorization: Bearer <token>

Response Body Success:

```json
{
  "data": {
    "id": "uuid",
    "text": "Belajar Next.js",
    "completed": false,
    "category": "Belajar",
    "createdAt": "2025-11-11T13:20:00.000Z",
    "updatedAt": "2025-11-11T13:20:00.000Z"
  }
}
```

Response Error:

```json
{
  "errors": "Task not found"
}
```

---

#### List All User Tasks

```http
End Point : GET /api/tasks
```

Header:

- Authorization: Bearer <token>

Response Body Success:

```json
{
  "data": [
    {
      "id": "uuid",
      "text": "Belajar Next.js",
      "completed": false,
      "category": "Belajar",
      "createdAt": "2025-11-11T13:20:00.000Z",
      "updatedAt": "2025-11-11T13:20:00.000Z"
    },
    {
      "id": "uuid2",
      "text": "Bikin To Do App",
      "completed": true,
      "category": "Project",
      "createdAt": "2025-11-09T09:00:00.000Z",
      "updatedAt": "2025-11-09T10:00:00.000Z"
    }
  ]
}
```

Response Error:

```json
{
  "errors": "No tasks found"
}
```

---

#### Delete Task

```http
End Point : DELETE /api/tasks/:taskId
```

Header:

- Authorization: Bearer <token>

Response Body Success:

```json
{
  "data": {
    "message": "Task deleted successfully!"
  }
}
```

Response Error:

```json
{
  "errors": "Task not found"
}
```
