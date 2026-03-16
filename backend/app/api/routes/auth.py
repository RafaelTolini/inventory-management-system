from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import LoginRequest, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=UserRead)
def login(
    credentials: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> UserRead:
    user = db.query(User).filter(User.username == credentials.username).first()

    # If the default admin user doesn't exist yet and the credentials match, create it on the fly.
    if user is None and credentials.username == DEFAULT_ADMIN_USERNAME and credentials.password == DEFAULT_ADMIN_PASSWORD:
        user = User(username=DEFAULT_ADMIN_USERNAME, hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD))
        db.add(user)
        db.commit()
        db.refresh(user)

    if user is None or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    request.session["user_id"] = user.id
    return user


@router.post("/logout")
def logout(request: Request) -> dict[str, str]:
    request.session.clear()
    return {"detail": "logged out"}


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user
