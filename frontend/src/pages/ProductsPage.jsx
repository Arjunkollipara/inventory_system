import { useEffect, useState } from "react";
import { createProduct, listProducts } from "../api";

const initialForm = { name: "", price: "", stock: "" };

export default function ProductsPage() {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    try {
      const data = await listProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createProduct({
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock)
      });

      setForm(initialForm);
      setSuccess("Product created.");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="section-head">
        <h2>Products</h2>
        <button className="btn ghost" type="button" onClick={loadProducts}>
          Refresh
        </button>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Product Name
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>

        <label>
          Price
          <input
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.inventory?.stock ?? "-"}</td>
                  <td>{new Date(product.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
