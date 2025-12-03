// src/shared/lib/apiClient.js

// Configuración base del cliente API
const baseURL = import.meta.env.API_URL ?? "http://localhost:3000";

class ApiClient {
  constructor() {
    this.baseURL = baseURL;
  }

  getAuthHeaders() {
    const headers = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Auth Headers:", headers);
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  async uploadFile(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };
    // Do not set Content-Type header - browser will set it with boundary for FormData

    try {
      const response = await fetch(url, {
        ...options,
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }
}

// Exportar una instancia única del cliente API
export const apiClient = new ApiClient();
