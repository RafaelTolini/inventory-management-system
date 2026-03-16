from sqlalchemy.orm import Session

from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate


def get_suppliers(db: Session, skip: int = 0, limit: int = 100) -> list[Supplier]:
    return db.query(Supplier).offset(skip).limit(limit).all()


def get_supplier(db: Session, supplier_id: int) -> Supplier | None:
    return db.get(Supplier, supplier_id)


def create_supplier(db: Session, supplier_in: SupplierCreate) -> Supplier:
    supplier = Supplier(**supplier_in.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


def update_supplier(db: Session, supplier: Supplier, supplier_in: SupplierUpdate) -> Supplier:
    data = supplier_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(supplier, key, value)
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


def delete_supplier(db: Session, supplier: Supplier) -> None:
    db.delete(supplier)
    db.commit()
