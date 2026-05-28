export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${window.location.origin}/_/backend/api`;
    }
  }
  return "http://localhost:5001/api";
};

export const getAuthHeaders = (): HeadersInit => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vp_token");
    if (token) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
    }
  }
  return {
    "Content-Type": "application/json"
  };
};

export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const url = `${getApiBaseUrl()}${path}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data;
};
