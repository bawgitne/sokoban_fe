const API_BASE = (import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "http://localhost:8787" : "")).replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
