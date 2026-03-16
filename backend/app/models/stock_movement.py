from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Integer, String, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.product import Product


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    product_id: Mapped[int] = mapped_column(
        ForeignKey(
            column="products.id",
            name="fk_stock_movement__product",
            onupdate="CASCADE",
        ),
        nullable=False,
    )
    product: Mapped["Product"] = relationship(
        passive_deletes=True,
        back_populates='stock_movements',
        foreign_keys=[product_id],
    )
