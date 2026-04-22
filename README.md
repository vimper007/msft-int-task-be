# task-manager-backend

A clean and beginner-friendly backend for a Task Manager app.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- Zod validation
- JWT auth

Note: SQLite with Prisma does not support native enum columns, so `status` and `priority` are stored as strings and strictly validated by Zod.

## Project Structure

```text
task-manager-backend/
  prisma/
    schema.prisma
    seed.ts
  postman/
    task-manager-backend.postman_collection.json
  src/
    config/
      env.ts
    controllers/
      auth.controller.ts
      task.controller.ts
    errors/
      api-error.ts
    middleware/
      auth.middleware.ts
      error.middleware.ts
      not-found.middleware.ts
      validate.middleware.ts
    prisma/
      client.ts
    routes/
      auth.routes.ts
      task.routes.ts
      index.ts
    services/
      auth.service.ts
      task.service.ts
    types/
      api.ts
      express.d.ts
    utils/
      api-response.ts
      async-handler.ts
      jwt.ts
      logger.ts
      password.ts
    validators/
      auth.validator.ts
      task.validator.ts
    app.ts
    server.ts
  .env.example
  .gitignore
  package.json
  tsconfig.json
  README.md
```

## Features

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Includes:

- Password hashing with `bcrypt`
- JWT-based auth (`Authorization: Bearer <token>`)
- Task ownership enforcement (users only access their own tasks)
- Zod request validation
- Centralized error handling
- Centralized API success format
- Filtering + search + sorting + pagination for task list
- Basic request logging with `morgan`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

(Windows PowerShell alternative)

```powershell
Copy-Item .env.example .env
```

3. Run Prisma migration:

```bash
npx prisma migrate dev --name init
```

4. Seed demo data:

```bash
npm run seed
```

5. Start development server:

```bash
npm run dev
```

Server URL:

- `http://localhost:4000`
- Health check: `GET /health`

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run seed
```

## API Response Format

Success:

```json
{
  "success": true,
  "message": "Task created",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Demo User (after seed)

- Email: `demo@example.com`
- Password: `Password123!`

## Sample cURL Requests

### Signup

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Get current user

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### Create task

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Prepare interview project",
    "description": "Build frontend with React + TypeScript",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-05-01T09:00:00.000Z"
  }'
```

### List tasks with filters

```bash
curl "http://localhost:4000/api/tasks?status=todo&priority=high&search=interview&sortBy=createdAt&order=desc&page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

### Update task

```bash
curl -X PUT http://localhost:4000/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "status": "done",
    "priority": "medium"
  }'
```

### Delete task

```bash
curl -X DELETE http://localhost:4000/api/tasks/<TASK_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

## Postman Collection

Import this file into Postman:

- `postman/task-manager-backend.postman_collection.json`

Set collection variables:

- `baseUrl` = `http://localhost:4000`
- `token` = JWT from login response
