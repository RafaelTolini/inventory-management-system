import { useState } from "react";
import { Link } from "react-router-dom";

export function ProductsPage({
  products,
  productForm,
  suppliers,
  loading,
  error,
  onProductInputChange,
  onProductSubmit,
  onLogout,
}) {
  const [nameFilter, setNameFilter] = useState("");
  const [skuFilter, setSkuFilter] = useState("");

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(nameFilter.toLowerCase());
    const skuMatch = product.sku.toLowerCase().includes(skuFilter.toLowerCase());
    return nameMatch && skuMatch;
  });

  const isSupplierSelected = productForm.supplier_id !== "";

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : "-";
  };

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">Manage products (add, edit, delete)</p>
        </div>
      </div>

      <form onSubmit={onProductSubmit} className="form-grid">
        <div className="field">
          <label className="field-label" htmlFor="product-name">
            Product name
          </label>
          <input
            id="product-name"
            name="name"
            placeholder="Product name"
            value={productForm.name}
            onChange={onProductInputChange}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="product-sku">
            SKU
          </label>
          <input
            id="product-sku"
            name="sku"
            placeholder="SKU"
            value={productForm.sku}
            onChange={onProductInputChange}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="product-quantity">
            Quantity
          </label>
          <input
            id="product-quantity"
            name="quantity"
            type="number"
            min="0"
            value={productForm.quantity}
            onChange={onProductInputChange}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="product-minimum-stock">
            Minimum stock
          </label>
          <input
            id="product-minimum-stock"
            name="minimum_stock"
            type="number"
            min="0"
            value={productForm.minimum_stock}
            onChange={onProductInputChange}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="product-price">
            Price
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={productForm.price}
            onChange={onProductInputChange}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="product-supplier">
            Supplier
          </label>
          <select
            id="product-supplier"
            name="supplier_id"
            value={productForm.supplier_id}
            onChange={onProductInputChange}
          >
            <option value="">No supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={!isSupplierSelected}>
          Add product
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="filters-row">
        <input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <input
          placeholder="Filter by SKU"
          value={skuFilter}
          onChange={(e) => setSkuFilter(e.target.value)}
        />
      </div>

      <section className="card">
        <h2>Product list</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Min stock</th>
                <th>Price</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={
                    product.quantity < product.minimum_stock ? "low-stock-row" : undefined
                  }
                >
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.quantity}</td>
                  <td>{product.minimum_stock}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{getSupplierName(product.supplier_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}
