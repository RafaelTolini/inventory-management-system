from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.supplier import (
    create_supplier,
    delete_supplier,
    get_supplier,
    get_suppliers,
    update_supplier,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.supplier import SupplierCreate, SupplierRead, SupplierUpdate

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


@router.get("", response_model=list[SupplierRead])
def list_suppliers(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[SupplierRead]:
    return get_suppliers(db=db, skip=skip, limit=limit)


@router.post("", response_model=SupplierRead, status_code=status.HTTP_201_CREATED)
def create_new_supplier(
    supplier_in: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SupplierRead:
    return create_supplier(db=db, supplier_in=supplier_in)


@router.put("/{supplier_id}", response_model=SupplierRead)
def update_existing_supplier(
    supplier_id: int,
    supplier_in: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SupplierRead:
    supplier = get_supplier(db=db, supplier_id=supplier_id)
    if supplier is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    return update_supplier(db=db, supplier=supplier, supplier_in=supplier_in)


@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    supplier = get_supplier(db=db, supplier_id=supplier_id)
    if supplier is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    delete_supplier(db=db, supplier=supplier)
