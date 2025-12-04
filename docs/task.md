# Task API

## Create Task

```http
End Point : POST /api/users/tasks
```

Header:

- Authorization: Bearer <token>
- Content-Type: application/json

Request Body:

```json
{
  "title": "Belajar Next.js",
  "desc": "Belajar"
}
```

Response Body Success:

```json
{
  "data": {
    "id":"<uuid>",
    "title":"membuat project",
    "desc":"membuat project",
    "complated":false,
    "updateAt":"2025-11-27T12:21:50.491Z",
    "createdAt":"2025-11-27T12:21:50.491Z",
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

## Update Task

```http
End Point : PUT /api/users/tasks/:taskId
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

## Get Task by id

```http
End Point : GET /api/users/tasks/:taskId
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

## List All User Tasks

```http
End Point : GET /api/users/tasks
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
## Search Task
```http
End Point : GET /api/users/tasks/search
```
Header: 

- Authorization: Bearer <Token>

Query params :

- title : Search title using like, optional
- createdAt : Search date createdAt using like, optional
- updatedAt : Search date updatedAt, optional
- page : Number of page, default 1
- size : Size per page, default 10

Response Body Success: 

```json
{
  "data": [
    {
      "id": "<uuid>",
      "title": "belajar mencintai dia",
      "desc": "harus bisa berusaha",
      "completed": false,
      "createdAt": "<date>",
      "updatedAt": "<date>"
    },
    {
      "id": "a6f551f2-f16f-4fce-b3be-2b5852719ec5",
      "title": "test title",
      "desc": "test desc",
      "completed": false,
      "createdAt": "2025-12-04T12:29:36.668Z",
      "updatedAt": "2025-12-04T12:29:36.668Z"
    }
  ],
  "paging": {
    "current_page": 2,
    "size": 10,
    "total_page": 2
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

## Delete Task

```http
End Point : DELETE /api/users/tasks/:taskId
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
