// This file manages the base API URL depending on the environment (local vs production)
// Vite uses import.meta.env.VITE_... for custom environment variables

// We check if a VITE_API_URL is provided by the deployment platform (e.g., Vercel).
// If not, we fall back to the local backend port 5000.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
