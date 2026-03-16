import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  NavLink,
} from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SuppliersPage } from "./pages/SuppliersPage";
import { MovementsPage } from "./pages/MovementsPage";

const API_BASE_URL = "http://localhost:8000/api/v1";

const initialProductForm = {
  name: "",
  sku: "",
  quantity: 0,
  minimum_stock: 0,
  price: 0,
  supplier_id: "",
};

const initialSupplierForm = { name: "", email: "", phone: "" };
const initialMovementForm = { product_id: "", type: "IN", quantity: 0 };

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [supplierForm, setSupplierForm] = useState(initialSupplierForm);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [movementForm, setMovementForm] = useState(initialMovementForm);
  const [recentMovements, setRecentMovements] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      }
      setIsAuthenticated(false);
      return false;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to load products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to load suppliers");
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentMovements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stock-movements?limit=5`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to load stock movements");
      }
      const data = await response.json();
      setRecentMovements(data);
    } catch (err) {
      setError((prev) => prev || err.message || "Unexpected error");
    }
  };

  useEffect(() => {
    (async () => {
      const ok = await checkAuth();
      setAuthChecked(true);
      if (!ok) {
        navigate("/");
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const path = location.pathname;
    if (path === "/") {
      loadProducts();
      loadSuppliers();
      loadRecentMovements();
    } else if (path === "/products") {
      // Need products and suppliers for the form and table
      loadProducts();
      loadSuppliers();
    } else if (path === "/suppliers") {
      loadSuppliers();
    } else if (path === "/movements") {
      loadProducts();
      loadRecentMovements();
    }
  }, [isAuthenticated, location.pathname]);

  const onMovementChange = (event) => {
    const { name, value } = event.target;
    setMovementForm((prev) => {
      if (name === "product_id") {
        return { ...prev, product_id: value };
      }
      if (name === "type") {
        return { ...prev, type: value };
      }
      if (name === "quantity") {
        return { ...prev, quantity: Number(value) };
      }
      return prev;
    });
  };

  const onProductInputChange = (event) => {
    const { name, value } = event.target;
    setProductForm((prev) => {
      if (name === "name" || name === "sku") {
        return { ...prev, [name]: value };
      }
      if (name === "supplier_id") {
        return { ...prev, supplier_id: value === "" ? "" : Number(value) };
      }
      return { ...prev, [name]: Number(value) };
    });
  };

  const onProductSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        name: productForm.name,
        sku: productForm.sku,
        quantity: Number(productForm.quantity),
        minimum_stock: Number(productForm.minimum_stock),
        price: Number(productForm.price),
        supplier_id: productForm.supplier_id === "" ? null : productForm.supplier_id,
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payload = await response.json();
        const detail = payload?.detail || "Failed to create product";
        throw new Error(detail);
      }

      setProductForm(initialProductForm);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  const onLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const onLoginSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginForm),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const detail = payload?.detail || "Invalid credentials";
        throw new Error(detail);
      }
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      setIsAuthenticated(false);
      setError(err.message || "Login failed");
    }
  };

  const onLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors on logout
    } finally {
      setIsAuthenticated(false);
      setProducts([]);
      setProductForm(initialProductForm);
      setSuppliers([]);
      setSupplierForm(initialSupplierForm);
      setMovementForm(initialMovementForm);
      navigate("/");
    }
  };

  const onSupplierChange = (event) => {
    const { name, value } = event.target;
    setSupplierForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSupplierSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const method = editingSupplierId ? "PUT" : "POST";
      const url = editingSupplierId
        ? `${API_BASE_URL}/suppliers/${editingSupplierId}`
        : `${API_BASE_URL}/suppliers`;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(supplierForm),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const detail = payload?.detail || "Failed to save supplier";
        throw new Error(detail);
      }
      setSupplierForm({ name: "", email: "", phone: "" });
      setEditingSupplierId(null);
      await loadSuppliers();
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  const onSupplierEditClick = (supplier) => {
    setEditingSupplierId(supplier.id);
    setSupplierForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone ?? "",
    });
  };

  const onSupplierDeleteClick = async (supplierId) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const detail = payload?.detail || "Failed to delete supplier";
        throw new Error(detail);
      }
      if (editingSupplierId === supplierId) {
        setEditingSupplierId(null);
        setSupplierForm({ name: "", email: "", phone: "" });
      }
      await loadSuppliers();
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };
  if (!authChecked) {
    return <main className="container"><p>Loading...</p></main>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">IM</div>
          <div className="sidebar-title">Inventory</div>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-nav-link${isActive ? " sidebar-nav-link-active" : ""}`
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `sidebar-nav-link${isActive ? " sidebar-nav-link-active" : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              `sidebar-nav-link${isActive ? " sidebar-nav-link-active" : ""}`
            }
          >
            Suppliers
          </NavLink>
          <NavLink
            to="/movements"
            className={({ isActive }) =>
              `sidebar-nav-link${isActive ? " sidebar-nav-link-active" : ""}`
            }
          >
            Movements
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          {isAuthenticated && (
            <button type="button" className="btn-secondary" onClick={onLogout}>
              Log out
            </button>
          )}
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">Inventory Dashboard</div>
          <div className="topbar-meta">Portfolio demo · FastAPI + React</div>
        </header>

        <main className="container">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  isAuthenticated={isAuthenticated}
                  loginForm={loginForm}
                  onLoginChange={onLoginChange}
                  onLoginSubmit={onLoginSubmit}
                  error={error}
                  onLogout={onLogout}
                  products={products}
                  totalProducts={products.length}
                  totalSuppliers={suppliers.length}
                  lowStockProducts={products.filter((p) => p.quantity < p.minimum_stock)}
                  recentMovements={recentMovements}
                />
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ProductsPage
                    products={products}
                    productForm={productForm}
                    suppliers={suppliers}
                    loading={loading}
                    error={error}
                    onProductInputChange={onProductInputChange}
                    onProductSubmit={onProductSubmit}
                    onLogout={onLogout}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/suppliers"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SuppliersPage
                    suppliers={suppliers}
                    supplierForm={supplierForm}
                    editingSupplierId={editingSupplierId}
                    loading={loading}
                    error={error}
                    onSupplierChange={onSupplierChange}
                    onSupplierSubmit={onSupplierSubmit}
                    onSupplierEditClick={onSupplierEditClick}
                    onSupplierDeleteClick={onSupplierDeleteClick}
                    onLogout={onLogout}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/movements"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MovementsPage
                    products={products}
                    recentMovements={recentMovements}
                    movementForm={movementForm}
                    error={error}
                    onMovementChange={onMovementChange}
                    onSubmitMovement={async (event) => {
                      event.preventDefault();
                      setError("");
                      if (!movementForm.product_id) {
                        setError("Select a product");
                        return;
                      }
                      if (movementForm.quantity <= 0) {
                        setError("Quantity must be positive");
                        return;
                      }

                      try {
                        const payload = {
                          product_id: Number(movementForm.product_id),
                          type: movementForm.type,
                          quantity: Number(movementForm.quantity),
                        };
                        const response = await fetch(`${API_BASE_URL}/stock-movements`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify(payload),
                        });
                        if (!response.ok) {
                          const data = await response.json().catch(() => null);
                          const detail = data?.detail || "Failed to record movement";
                          throw new Error(detail);
                        }
                        setMovementForm(initialMovementForm);
                        await Promise.all([loadProducts(), loadRecentMovements()]);
                      } catch (err) {
                        setError(err.message || "Unexpected error");
                      }
                    }}
                  />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
