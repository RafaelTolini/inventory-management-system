import { Link } from "react-router-dom";

export function SuppliersPage({
  suppliers,
  supplierForm,
  editingSupplierId,
  loading,
  error,
  onSupplierChange,
  onSupplierSubmit,
  onSupplierEditClick,
  onSupplierDeleteClick,
  onLogout,
}) {
  return (
    <>
      <section className="card">
        <div className="page-header">
          <div>
            <h1>Suppliers</h1>
            <p className="subtitle">Manage suppliers (add, edit, delete)</p>
          </div>
        </div>

        <form onSubmit={onSupplierSubmit} className="form-grid">
          <div className="field">
            <label className="field-label" htmlFor="supplier-name">
              Supplier name
            </label>
            <input
              id="supplier-name"
              name="name"
              placeholder="Supplier name"
              value={supplierForm.name}
              onChange={onSupplierChange}
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="supplier-email">
              Email
            </label>
            <input
              id="supplier-email"
              name="email"
              type="email"
              placeholder="Email"
              value={supplierForm.email}
              onChange={onSupplierChange}
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="supplier-phone">
              Phone (optional)
            </label>
            <input
              id="supplier-phone"
              name="phone"
              placeholder="Phone (optional)"
              value={supplierForm.phone}
              onChange={onSupplierChange}
            />
          </div>
          <button type="submit">{editingSupplierId ? "Update" : "Add"} supplier</button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Supplier list</h2>
        {loading ? (
          <p>Loading...</p>
        ) : suppliers.length === 0 ? (
          <p>No suppliers yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone || "-"}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onSupplierEditClick(supplier)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-secondary btn-danger"
                        onClick={() => onSupplierDeleteClick(supplier.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
