import { Link } from "react-router-dom";

export function DashboardPage({
  isAuthenticated,
  loginForm,
  onLoginChange,
  onLoginSubmit,
  error,
  onLogout,
  products,
  totalProducts,
  totalSuppliers,
  lowStockProducts,
  recentMovements,
}) {
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `#${productId}`;
  };

  if (!isAuthenticated) {
    return (
      <section className="card">
        <h1>Inventory Login</h1>
        <p className="subtitle">Sign in to access the dashboard</p>

        <form onSubmit={onLoginSubmit} className="form-grid">
          <div className="field">
            <label className="field-label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              name="username"
              placeholder="Username"
              value={loginForm.username}
              onChange={onLoginChange}
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={onLoginChange}
              required
            />
          </div>
          <button type="submit">Log in</button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>
    );
  }

  return (
    <>
      <section className="card">
        <div className="page-header">
          <div>
            <h1>Inventory Overview</h1>
            <p className="subtitle">Key metrics for products and suppliers</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h2>Total products</h2>
            <p className="stat-value">{totalProducts}</p>
          </div>
          <div className="stat-card">
            <h2>Total suppliers</h2>
            <p className="stat-value">{totalSuppliers}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Products below minimum stock</h2>
        {lowStockProducts.length === 0 ? (
          <p>All products are at or above minimum stock.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Minimum stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.quantity}</td>
                  <td>{p.minimum_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>Last 5 movements</h2>
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
              {recentMovements.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.timestamp).toLocaleString()}</td>
                  <td>{getProductName(m.product_id)}</td>
                  <td>{m.type}</td>
                  <td>{m.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
