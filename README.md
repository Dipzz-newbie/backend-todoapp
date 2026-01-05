# Backend Todo App

Backend Todo App is a server built with TypeScript and Express.js, designed to manage user accounts and tasks. This project demonstrates clean architecture and best practices in building backend applications, including database integration using Prisma and tests with Jest.

## Features
- User Registration and Authentication (JWT-Based).
- Task Management: Create, Read, Update, Delete (CRUD operations).
- Token Refresh Mechanism.
- API Rate Limiting with `express-rate-limit`.
- Comprehensive Unit and Integration Testing.

---

## Getting Started
### 1. Prerequisites
- Node.js (v16 or later).
- PostgreSQL database.
- npm (bundled with Node.js) or yarn.

### 2. Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dipzz-newbie/backend-todoapp.git
   ```

2. Navigate to the project directory:
   ```bash
   cd backend-todoapp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your `.env` file:
   Create a `.env` file in the project root, based on the `DATABASE_URL` environment variable, to connect to your PostgreSQL database.

   Example format:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=3600 # in seconds
   ```

5. Run database migrations:
   ```bash
   npm run prisma
   ```

6. Generate the Prisma Client:
   ```bash
   npm run postinstall
   ```

7. Build the TypeScript code:
   ```bash
   npm run build
   ```

8. Start the server:
   ```bash
   npm start
   ```

---

## API Documentation

### User API
The following endpoints manage user accounts:

#### Register API
- **Endpoint**: `POST /api/register`
- **Header**: `Content-Type: application/json`
  
Request Body:
```json
{
  "email": "test@example.com",
  "password": "rahasia",
  "name": "Dipz"
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
    "updatedAt": null
  }
}
```

... (Refer to `docs/user.md` for full details)

### Task API
The following endpoints manage user tasks:

#### Create Task
- **Endpoint**: `POST /api/users/tasks`
- **Header**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
  
Request Body:
```json
{
  "title": "Belajar Next.js",
  "desc": "Belajar"
}
```
Response Body (Success):
```json
{
  "data": {
    "id":"<uuid>",
    "title":"Belajar Next.js",
    "desc":"Belajar",
    "complated":false,
    "updateAt":"2025-11-27T12:21:50.491Z",
    "createdAt":"2025-11-27T12:21:50.491Z",
  }
}
```

... (Refer to `docs/task.md` for full details)

---

## Testing

Run tests using Jest:

```bash
npm test
```

Test configurations are defined in `jest.config.json`.

---

## Project Structure

- **src/**: Application source code.
- **docs/**: API documentation.
- **dist/**: Compiled JavaScript code (output from TypeScript).
- **test/**: Unit and integration tests.
- **prisma/**: ORM schema and migrations.

---

## Dependencies

Refer to `package.json` for full details. Key dependencies include:
- `express`
- `@prisma/client`
- `jsonwebtoken`
- `bcrypt`
- `typescript`
- ... others.

---

## License
This project is licensed under the ISC License.
