# Policy Management System Admin Dashboard

Full-stack admin dashboard built with React, Axios, Bootstrap 5, Node.js, Express, and MongoDB.

## Features

- Create, read, update, and delete insurance policies
- Create installment payment plans for a policy
- Mark individual installments as paid
- Dashboard summary cards for policies and collected premium

## Project Structure

- `backend`: Express API with MongoDB models
- `frontend`: React admin dashboard powered by Vite

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with your MongoDB connection string.

4. Start backend:

```bash
npm run dev:backend
```

5. Start frontend in a new terminal:

```bash
npm run dev:frontend
```

## API Endpoints

- `GET /api/policies`
- `POST /api/policies`
- `PUT /api/policies/:id`
- `DELETE /api/policies/:id`
- `GET /api/installments`
- `POST /api/installments`
- `PATCH /api/installments/:id/pay/:installmentNumber`
