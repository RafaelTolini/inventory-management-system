from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.schemas.stock_movement import StockMovementCreate


def create_stock_movement(db: Session, movement_in: StockMovementCreate) -> StockMovement:
    product = db.get(Product, movement_in.product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if movement_in.type not in {"IN", "OUT"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid movement type")

    if movement_in.quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be positive")

    if movement_in.type == "OUT" and product.quantity - movement_in.quantity < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Negative stock not allowed")

    if movement_in.type == "IN":
        product.quantity += movement_in.quantity
    else:  # OUT
        product.quantity -= movement_in.quantity

    movement = StockMovement(
        product_id=movement_in.product_id,
        type=movement_in.type,
        quantity=movement_in.quantity,
    )

    db.add(product)
    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement


def get_recent_stock_movements(db: Session, limit: int = 5) -> list[StockMovement]:
    return (
        db.query(StockMovement)
        .order_by(StockMovement.timestamp.desc())
        .limit(limit)
        .all()
    )
