/**
 * ================================================================
 * API REQUEST CLIENT
 * ================================================================
 *
 * Base axios client for making API requests
 */

import axios from "axios";

// Create a dedicated axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080", // No /api suffix to prevent double prefixing
  timeout: 15000, // Extended timeout for better reliability
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper function to ensure proper URL formatting for direct API calls
export const formatApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Check if path already starts with 'api/'
  if (cleanPath.startsWith("api/")) {
    return cleanPath;
  }

  // Add api/ prefix if missing
  return `api/${cleanPath}`;
};

export default apiClient;
