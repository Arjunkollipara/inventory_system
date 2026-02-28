const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

function buildUrl(path, query = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${cleanPath}`, window.location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return `${url.pathname}${url.search}`;
}

async function apiRequest(path, options = {}, query = {}) {
  const response = await fetch(buildUrl(path, query), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.detail
        ? payload.detail
        : payload || response.statusText;
    throw new Error(message || "Request failed");
  }

  return payload;
}

export function getHealth() {
  return apiRequest("/health");
}

export function getDbCheck() {
  return apiRequest("/db-check");
}

export function listProducts() {
  return apiRequest("/products");
}

export function createProduct(data) {
  return apiRequest("/products", { method: "POST", body: JSON.stringify(data) });
}

export function listOrders() {
  return apiRequest("/orders");
}

export function createOrder(data) {
  return apiRequest("/orders", { method: "POST", body: JSON.stringify(data) });
}

export function listLogs(params = {}) {
  return apiRequest("/logs", {}, params);
}
