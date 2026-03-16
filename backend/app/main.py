from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.security import DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME, hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.user import User

app = FastAPI(title=settings.project_name)

if settings.backend_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
    session_cookie=settings.session_cookie_name,
)


@app.on_event("startup")
def on_startup() -> None:
    # Ensure tables exist (still useful in dev; migrations recommended for prod)
    Base.metadata.create_all(bind=engine)

    # Seed a default admin user if it doesn't exist.
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == DEFAULT_ADMIN_USERNAME).first()
        if user is None:
            user = User(
                username=DEFAULT_ADMIN_USERNAME,
                hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
            )
            db.add(user)
            db.commit()
    finally:
        db.close()


app.include_router(api_router, prefix=settings.api_v1_prefix)
