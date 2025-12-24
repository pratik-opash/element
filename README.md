# Simple Node.js Boilerplate

Express + MongoDB starter with RESTful CRUD for blog posts, projects, and JWT auth.

## Architecture

- `src/models` – Mongoose schemas (`BlogPost`, `Project`, `User`).
- `src/controllers` – business logic per resource.
- `src/routes` – Express routers mounted under `/api/*`.
- `src/config/db.js` – Mongo connection helper.
- `src/index.js` – app entry; wires middlewares, routes, error handling.

## Getting Started

1. `cp example.env .env` and fill `MONGODB_URI` + `JWT_SECRET`.
2. `npm install`
3. `npm run dev` for auto-reload (`node --watch`) or `npm start` once.

## Environment Variables

```
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=replace-with-strong-secret
```

## API Overview

Base URL: `http://localhost:<PORT>`

### Blog Posts
- `GET /api/blogs` – list all blog posts.
- `GET /api/blogs/:id` – fetch a single post.
- `POST /api/blogs` – create (body: `title`, `excerpt`, `content`, etc.).
- `PUT /api/blogs/:id` – update existing post.
- `DELETE /api/blogs/:id` – remove a post.

### Projects
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Auth
- `POST /api/auth/register` – create user (name, email, password).
- `POST /api/auth/login` – returns `{ token, user }` (Bearer token).
- `POST /api/auth/logout` – send existing Bearer token; server revokes it.
- `POST /api/auth/change-password` – requires auth; body `{ currentPassword, newPassword }`.

Protected routes expect `Authorization: Bearer <token>`.

Request/response payloads match the sample structures provided in `src/models`.

