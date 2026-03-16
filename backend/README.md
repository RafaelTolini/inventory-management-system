# Backend

FastAPI backend for the inventory management system.

## Run

```bash
cp .env.example .env
poetry install
poetry run uvicorn app.main:app --reload
```

API docs: `http://localhost:8000/docs`

## Migrations

Alembic is configured in `alembic.ini` and `alembic/`.

```bash
poetry run alembic upgrade head
poetry run alembic revision --autogenerate -m "message"
```
