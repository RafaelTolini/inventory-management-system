from __future__ import annotations

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Product, Supplier, StockMovement


def seed_suppliers(db: Session) -> list[Supplier]:
    existing = db.query(Supplier).count()
    if existing >= 4:
        return db.query(Supplier).all()

    suppliers_data = [
        {"name": "Acme Corp", "email": "sales@acmecorp.example.com", "phone": "+1-555-1000"},
        {"name": "Global Supplies", "email": "contact@globalsupplies.example.com", "phone": "+1-555-2000"},
        {"name": "Warehouse Central", "email": "info@warehousecentral.example.com", "phone": "+1-555-3000"},
        {"name": "Northwind Traders", "email": "orders@northwindtraders.example.com", "phone": "+1-555-4000"},
    ]

    suppliers: list[Supplier] = []
    for data in suppliers_data:
        supplier = Supplier(**data)
        db.add(supplier)
        suppliers.append(supplier)

    db.commit()
    for s in suppliers:
        db.refresh(s)
    return suppliers


def seed_products(db: Session, suppliers: list[Supplier]) -> list[Product]:
    existing = db.query(Product).count()
    if existing >= 7:
        return db.query(Product).all()

    # Simple round-robin assignment of suppliers
    def pick_supplier(index: int) -> Supplier:
        return suppliers[index % len(suppliers)]

    products_data = [
        {"name": "Laptop 14\"", "sku": "LAP-14", "quantity": 15, "minimum_stock": 5, "price": 899.99},
        {"name": "Laptop 16\"", "sku": "LAP-16", "quantity": 4, "minimum_stock": 5, "price": 1299.99},
        {"name": "Wireless Mouse", "sku": "MSE-WLS", "quantity": 50, "minimum_stock": 10, "price": 24.99},
        {"name": "Mechanical Keyboard", "sku": "KEY-MECH", "quantity": 8, "minimum_stock": 10, "price": 89.99},
        {"name": "27\" Monitor", "sku": "MON-27", "quantity": 12, "minimum_stock": 5, "price": 219.99},
        {"name": "USB-C Dock", "sku": "DOCK-USBC", "quantity": 3, "minimum_stock": 5, "price": 149.99},
        {"name": "External SSD 1TB", "sku": "SSD-1TB", "quantity": 25, "minimum_stock": 10, "price": 129.99},
    ]

    products: list[Product] = []
    for idx, data in enumerate(products_data):
        supplier = pick_supplier(idx)
        product = Product(
            name=data["name"],
            sku=data["sku"],
            quantity=data["quantity"],
            minimum_stock=data["minimum_stock"],
            price=data["price"],
            supplier_id=supplier.id,
        )
        db.add(product)
        products.append(product)

    db.commit()
    for p in products:
        db.refresh(p)
    return products


def seed_movements(db: Session, products: list[Product]) -> None:
    existing = db.query(StockMovement).count()
    if existing > 0:
        return

    movements_data = [
        {"product": products[0], "type": "IN", "quantity": 10},
        {"product": products[1], "type": "OUT", "quantity": 2},
        {"product": products[2], "type": "OUT", "quantity": 5},
        {"product": products[3], "type": "IN", "quantity": 3},
        {"product": products[4], "type": "OUT", "quantity": 1},
    ]

    for item in movements_data:
        movement = StockMovement(
            product_id=item["product"].id,
            type=item["type"],
            quantity=item["quantity"],
        )
        # Adjust quantity to reflect movement
        if item["type"] == "IN":
            item["product"].quantity += item["quantity"]
        else:
            item["product"].quantity -= item["quantity"]

        db.add(movement)
        db.add(item["product"])

    db.commit()


def main() -> None:
    db = SessionLocal()
    try:
        suppliers = seed_suppliers(db)
        products = seed_products(db, suppliers)
        seed_movements(db, products)
        print("Demo data seeded: suppliers, products, and movements.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
