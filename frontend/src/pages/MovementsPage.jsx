export function MovementsPage({
  products,
  recentMovements,
  movementForm,
  error,
  onMovementChange,
  onSubmitMovement,
}) {
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `#${productId}`;
  };

  return (
    <>
      <section className="card">
        <div className="page-header">
          <div>
            <h1>Record movement</h1>
            <p className="subtitle">Adjust stock for a product</p>
          </div>
        </div>

        <form onSubmit={onSubmitMovement} className="form-grid">
          <div className="field">
            <label className="field-label" htmlFor="movement-product">
              Product
            </label>
            <select
              id="movement-product"
              name="product_id"
              value={movementForm.product_id}
              onChange={onMovementChange}
              required
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="movement-type">
              Type
            </label>
            <select
              id="movement-type"
              name="type"
              value={movementForm.type}
              onChange={onMovementChange}
            >
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="movement-quantity">
              Quantity
            </label>
            <input
              id="movement-quantity"
              name="quantity"
              type="number"
              min="1"
              value={movementForm.quantity}
              onChange={onMovementChange}
              required
            />
          </div>
          <button type="submit">Record movement</button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Recent movements</h2>
        {recentMovements.length === 0 ? (
          <p>No movements yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{new Date(movement.timestamp).toLocaleString()}</td>
                  <td>{getProductName(movement.product_id)}</td>
                  <td>{movement.type}</td>
                  <td>{movement.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
