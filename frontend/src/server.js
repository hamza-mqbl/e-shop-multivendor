// Backend API base URL.
//   - Local dev: falls back to http://localhost:8000 (backend runs on port 8000)
//   - Production (Vercel): set REACT_APP_API_URL to the deployed backend origin,
//     e.g. https://qadam-shoe-store-be.vercel.app  (no trailing slash, no /api/v2)
const API_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const server = `${API_ORIGIN}/api/v2`;
export const backend_url = `${API_ORIGIN}/`;
