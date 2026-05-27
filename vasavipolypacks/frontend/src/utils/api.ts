const API_BASE_URL = "http://localhost:5001/api";

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
  const url = `${API_BASE_URL}${path}`;
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
