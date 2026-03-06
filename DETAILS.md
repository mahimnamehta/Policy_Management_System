# Policy Management System Details

## Stack

- Frontend: React.js, Axios, Bootstrap 5, Vite
- Backend: Node.js, Express.js, MongoDB, Mongoose
- HTTP client: Axios

## Project Structure

- `backend/`
  - `config/db.js`: MongoDB connection setup
  - `models/Policy.js`: Policy schema
  - `models/InstallmentPlan.js`: Installment plan schema
  - `controllers/policyController.js`: Policy CRUD logic
  - `controllers/installmentController.js`: Installment creation and payment update logic
  - `routes/policyRoutes.js`: Policy API routes
  - `routes/installmentRoutes.js`: Installment API routes
  - `server.js`: Express app entry point
- `frontend/`
  - `src/App.jsx`: Main admin dashboard page
  - `src/api/policyApi.js`: Axios API wrapper
  - `src/components/PolicyForm.jsx`: Create and update policy form
  - `src/components/PolicyTable.jsx`: Policy listing with edit and delete actions
  - `src/components/InstallmentManager.jsx`: Installment plan form and payment tracker
  - `src/components/AlertMessage.jsx`: Alert component
  - `src/components/StatCard.jsx`: Dashboard summary card component
  - `src/styles/app.css`: Dashboard styling

## Features

- Create policy
- Read policy list
- Update policy
- Delete policy
- Create installment payment plan for a policy
- Mark each installment as paid
- Dashboard summary cards for:
  - Total policies
  - Active policies
  - Installment plan count
  - Collected premium

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment files

Backend file: `backend/.env`

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/policy-management
CLIENT_URL=http://localhost:5173
```

Frontend file: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### 3. Start MongoDB

You need MongoDB running before the backend can start successfully.

Example local URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/policy-management
```

### 4. Run backend

```bash
npm run dev:backend
```

Backend runs on:

```text
http://localhost:5001
```

### 5. Run frontend

```bash
npm run dev:frontend
```

Frontend runs on:

```text
http://localhost:5173
```

## API Details

Base URL:

```text
http://localhost:5001/api
```

### Health API

#### GET `/api/health`

Response:

```json
{
  "status": "ok"
}
```

## Policy APIs

### 1. Get all policies

#### GET `/api/policies`

Response:

```json
[
  {
    "_id": "policy_id",
    "policyNumber": "POL-1001",
    "customerName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "policyType": "Health",
    "coverageAmount": 100000,
    "premiumAmount": 1200,
    "startDate": "2026-03-01T00:00:00.000Z",
    "endDate": "2027-03-01T00:00:00.000Z",
    "status": "Active",
    "notes": "First year policy",
    "createdAt": "2026-03-06T00:00:00.000Z",
    "updatedAt": "2026-03-06T00:00:00.000Z"
  }
]
```

### 2. Create policy

#### POST `/api/policies`

Request body:

```json
{
  "policyNumber": "POL-1001",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "policyType": "Health",
  "coverageAmount": 100000,
  "premiumAmount": 1200,
  "startDate": "2026-03-01",
  "endDate": "2027-03-01",
  "status": "Active",
  "notes": "First year policy"
}
```

Success response:

```json
{
  "_id": "policy_id",
  "policyNumber": "POL-1001",
  "customerName": "John Doe"
}
```

### 3. Update policy

#### PUT `/api/policies/:id`

Request body:

```json
{
  "customerName": "John Smith",
  "status": "Active",
  "premiumAmount": 1500
}
```

### 4. Delete policy

#### DELETE `/api/policies/:id`

Success response:

```json
{
  "message": "Policy deleted successfully"
}
```

## Installment APIs

### 1. Get all installment plans

#### GET `/api/installments`

Response:

```json
[
  {
    "_id": "plan_id",
    "policy": {
      "_id": "policy_id",
      "policyNumber": "POL-1001",
      "customerName": "John Doe",
      "policyType": "Health",
      "premiumAmount": 1200,
      "status": "Active"
    },
    "totalAmount": 1200,
    "installmentCount": 3,
    "firstDueDate": "2026-03-10T00:00:00.000Z",
    "paymentMethod": "Card",
    "installments": [
      {
        "installmentNumber": 1,
        "dueDate": "2026-03-10T00:00:00.000Z",
        "amount": 400,
        "status": "Pending",
        "paidAt": null
      }
    ]
  }
]
```

### 2. Create installment plan

#### POST `/api/installments`

Request body:

```json
{
  "policy": "policy_id",
  "totalAmount": 1200,
  "installmentCount": 3,
  "firstDueDate": "2026-03-10",
  "paymentMethod": "Card"
}
```

What this does:

- Validates that the policy exists
- Splits `totalAmount` into multiple installments
- Creates monthly due dates starting from `firstDueDate`
- Saves all generated installments in one plan

### 3. Mark an installment as paid

#### PATCH `/api/installments/:id/pay/:installmentNumber`

Example:

```text
PATCH /api/installments/65f123456/pay/2
```

Success behavior:

- Finds the installment plan by plan id
- Finds the requested installment number
- Sets `status` to `Paid`
- Sets `paidAt` to the current date/time

## Frontend Behavior

- The left side shows dashboard summary cards
- Policy form supports create and update in the same component
- Policy table supports edit and delete
- Installment form supports selecting a policy and generating multiple installments
- Payment tracker lets admin mark each installment as paid
- All API requests use Axios from `frontend/src/api/policyApi.js`

## Commands

Install:

```bash
npm install
```

Run backend:

```bash
npm run dev:backend
```

Run frontend:

```bash
npm run dev:frontend
```

Build frontend:

```bash
npm run build --workspace frontend
```

## Notes

- Backend requires MongoDB to be running
- Frontend and backend are configured for local development
- If you already have an existing backend with different routes, update `frontend/.env` and `frontend/src/api/policyApi.js`

## Troubleshooting

### MongoDB connection refused

If you see:

```text
MongoDB connection failed: connect ECONNREFUSED 127.0.0.1:27017
```

then MongoDB is not running on your machine. Start MongoDB first or change `MONGODB_URI` in `backend/.env`.

### Port 5000 already in use

If you see:

```text
Error: listen EADDRINUSE: address already in use :::5000
```

change the backend port in `backend/.env`, for example:

```env
PORT=5001
```
