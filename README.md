# Inventory Management System

Portfolio project scaffold with:

- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: React (Vite)
- Python package manager: Poetry

## Project structure

```text
inventory-management-system/
├── backend/
│   ├── app/
│   ├── pyproject.toml
│   └── .env.example
├── frontend/
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

## Prerequisites

- Python 3.12+
- Poetry
- Node.js 20+
- npm
- Docker + Docker Compose

## 1) Start PostgreSQL

```bash
docker compose up -d db
```

Database defaults:

- Database: `inventory`
- User: `inventory_user`
- Password: `inventory_password`
- Port: `5432`

## 2) Run backend

```bash
cd backend
cp .env.example .env
poetry install
poetry run uvicorn app.main:app --reload
```

Backend URL: `http://localhost:8000`
Docs: `http://localhost:8000/docs`

## 3) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## 4) Database migrations (Alembic)

From the `backend` folder:

```bash
poetry run alembic upgrade head     # apply all migrations
poetry run alembic revision --autogenerate -m "add warehouses"  # new migration
```

An initial migration `0001_create_products_table` is provided.

## 5) Using just (optional)

If you have `just` installed, from the project root you can run:

```bash
just up           # start PostgreSQL
just backend      # run FastAPI backend
just frontend     # run React frontend
just migrate      # apply migrations
just migration "add warehouses"  # autogenerate new migration
```

## API endpoints (starter)

- `GET /api/v1/health`
- `GET /api/v1/products`
- `POST /api/v1/products`

## Next recommended steps

- Add Alembic for database migrations
- Add authentication (JWT)
- Add tests for API routes and database layer
- Add product categories, stock movements, and dashboard metrics
