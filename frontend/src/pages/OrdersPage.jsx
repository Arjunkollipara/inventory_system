import { useEffect, useState } from "react";
import { createOrder, listLogs, listOrders } from "../api";

const orderInitial = { userId: "", productId: "", quantity: 1 };

export default function OrdersPage() {
  const [orderForm, setOrderForm] = useState(orderInitial);
  const [filter, setFilter] = useState({ startDate: "", endDate: "" });
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadOrders() {
    try {
      const data = await listOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    }
  }

  async function loadLogs() {
    try {
      const data = await listLogs({
        start_date: filter.startDate ? `${filter.startDate}T00:00:00` : undefined,
        end_date: filter.endDate ? `${filter.endDate}T23:59:59` : undefined
      });
      setLogs(data);
    } catch (err) {
      setError(err.message || "Failed to load logs.");
    }
  }

  useEffect(() => {
    loadOrders();
    loadLogs();
  }, []);

  async function handleOrderSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createOrder({
        user_id: Number(orderForm.userId),
        items: [
          {
            product_id: Number(orderForm.productId),
            quantity: Number(orderForm.quantity)
          }
        ]
      });

      setOrderForm(orderInitial);
      setSuccess("Order created.");
      await Promise.all([loadOrders(), loadLogs()]);
    } catch (err) {
      setError(err.message || "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFilter(event) {
    event.preventDefault();
    setError("");
    await loadLogs();
  }

  return (
    <section className="page">
      <div className="section-head">
        <h2>Orders</h2>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            loadOrders();
            loadLogs();
          }}
        >
          Refresh
        </button>
      </div>

      <form className="panel form-grid" onSubmit={handleOrderSubmit}>
        <label>
          User ID
          <input
            type="number"
            min="1"
            required
            value={orderForm.userId}
            onChange={(e) => setOrderForm((prev) => ({ ...prev, userId: e.target.value }))}
          />
        </label>

        <label>
          Product ID
          <input
            type="number"
            min="1"
            required
            value={orderForm.productId}
            onChange={(e) => setOrderForm((prev) => ({ ...prev, productId: e.target.value }))}
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="1"
            required
            value={orderForm.quantity}
            onChange={(e) => setOrderForm((prev) => ({ ...prev, quantity: e.target.value }))}
          />
        </label>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Create Order"}
        </button>
      </form>

      <form className="panel filter-row" onSubmit={handleFilter}>
        <label>
          Start Date
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </label>
        <button className="btn ghost" type="submit">
          Filter Logs
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      <div className="split-grid">
        <div className="panel table-wrap">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_id}</td>
                    <td>
                      {order.items.map((item) => `${item.product_id} x${item.quantity}`).join(", ")}
                    </td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="panel log-panel">
          <h3>Order Logs</h3>
          {logs.length === 0 ? (
            <p className="empty-cell">No logs available.</p>
          ) : (
            <ul className="log-list">
              {logs.map((log, index) => (
                <li key={`${log.order_id}-${index}`}>
                  <span className="badge">{log.action}</span>
                  <p>Order #{log.order_id}</p>
                  <p>User #{log.user_id}</p>
                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
