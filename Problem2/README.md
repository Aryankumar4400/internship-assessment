# Problem 2 — Registration, Login & Dashboard

## Overview

This folder contains a small Node.js + Express application implementing:

- Registration module (POST `/api/auth/register`)
- Login module (POST `/api/auth/login`)
- Protected dashboard (GET `/dashboard`)

Auth is JWT-based. Users are stored in a local JSON file (file-based storage; no MongoDB needed).

## Project Structure

- `server/server.js` — Express server
- `server/data/users.json` — user storage (created automatically)
- `server/public/` — frontend HTML/CSS/JS

## Setup & Run

1. Open terminal in `internship-assessment/Problem2/server`
2. Install dependencies
   ```bash
   npm install
   ```
3. Start server

   ```bash
   node server.js
   ```

   or (if nodemon is installed)

   ```bash
   npx nodemon server.js
   ```

4. Open in browser:
   - Dashboard: http://localhost:3000/dashboard
   - Registration: http://localhost:3000/register
   - Login: http://localhost:3000/login

## Environment Variables

The app uses defaults if you do not set them.

- `JWT_SECRET` (default: `dev-secret-change-me`)
- `PORT` (default: `3000`)

## API

### Register

`POST /api/auth/register`
Body:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourPassword"
}
```

### Login

`POST /api/auth/login`
Body:

```json
{
  "email": "you@example.com",
  "password": "yourPassword"
}
```

Responses:

- On success, returns `{ "token": "..." }`
- On failure, returns `{ "error": "..." }`
