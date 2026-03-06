# Mini Policy Management System (TypeScript Full Stack)

Full stack project with React + TypeScript frontend and Node.js/Express + TypeScript backend using MongoDB.

## Features

- Policy CRUD management
- Installment management (add, view history, mark paid)
- Dashboard summary (total policies, collected amount, pending installments)
- Search/filter for policies
- Structured backend architecture with services/controllers/validators
- Environment-based configuration

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Axios, React Router
- **Backend**: Node.js, Express, TypeScript, Mongoose, Zod
- **Database**: MongoDB

## Project Structure

- `backend/` - API server
- `frontend/` - React client

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

### 3) Run backend

```bash
npm run dev --workspace backend
```

### 4) Run frontend

```bash
npm run dev --workspace frontend
```

## API Endpoints

### Policy APIs
- `POST /api/policies` - Create policy
- `GET /api/policies` - List policies
- `GET /api/policies/:id` - Get policy details
- `PUT /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Delete policy

### Installment APIs
- `POST /api/policies/:id/installment` - Add installment
- `PUT /api/installment/:installmentId/pay` - Mark installment as paid
- `GET /api/policies/:id/installments` - List installments by policy

### Dashboard APIs
- `GET /api/dashboard/summary` - Dashboard summary
