import { useEffect, useMemo, useState } from "react";
import { getDbCheck, getHealth, listLogs, listOrders, listProducts } from "../api";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    apiStatus: "Checking",
    dbStatus: "Checking",
    products: 0,
    orders: 0,
    logs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [healthRes, dbRes, products, orders, logs] = await Promise.all([
        getHealth(),
        getDbCheck(),
        listProducts(),
        listOrders(),
        listLogs()
      ]);

      setSummary({
        apiStatus: healthRes?.status || "Unknown",
        dbStatus: dbRes?.db_status || "Unknown",
        products: products.length,
        orders: orders.length,
        logs: logs.length
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = useMemo(
    () => [
      { label: "API Status", value: summary.apiStatus },
      { label: "DB Status", value: summary.dbStatus },
      { label: "Products", value: summary.products },
      { label: "Orders", value: summary.orders },
      { label: "Order Logs", value: summary.logs }
    ],
    [summary]
  );

  return (
    <section className="page">
      <div className="section-head">
        <h2>Dashboard</h2>
        <button className="btn ghost" type="button" onClick={loadDashboard} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="card-grid">
        {cards.map((card) => (
          <article className="card" key={card.label}>
            <p className="card-label">{card.label}</p>
            <p className="card-value">{loading ? "..." : card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
