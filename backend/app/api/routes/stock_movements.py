from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.stock_movement import create_stock_movement, get_recent_stock_movements
from app.db.session import get_db
from app.models.user import User
from app.schemas.stock_movement import StockMovementCreate, StockMovementRead

router = APIRouter(prefix="/stock-movements", tags=["stock-movements"])


@router.post("", response_model=StockMovementRead)
def record_stock_movement(
    movement_in: StockMovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StockMovementRead:
    return create_stock_movement(db=db, movement_in=movement_in)


@router.get("", response_model=list[StockMovementRead])
def list_recent_stock_movements(
    limit: int = Query(default=5, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[StockMovementRead]:
    return get_recent_stock_movements(db=db, limit=limit)
