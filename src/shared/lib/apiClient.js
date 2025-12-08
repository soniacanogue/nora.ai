// src/shared/lib/apiClient.js

// Configuración base del cliente API
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

console.log(import.meta.env.VITE_API_URL);

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
    // Support optional params object in options to build query string
    let endpointWithParams = endpoint;
    if (options.params && typeof options.params === "object") {
      try {
        const search = new URLSearchParams();
        Object.entries(options.params).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (typeof v === "string" && v.trim() === "") return;
          search.append(k, String(v));
        });
        const qs = search.toString();
        if (qs) {
          endpointWithParams = `${endpoint}${endpoint.includes("?") ? "&" : "?"}${qs}`;
        }
      } catch (e) {
        console.warn("Failed to build query params", e);
      }
    }

    const url = `${this.baseURL}${endpointWithParams}`;
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
        // Manejo global de errores de autenticación (401)
        if (response.status === 401) {
          console.warn("Sesión expirada o inválida. Redirigiendo al login...");
          localStorage.removeItem("token");
          
          // Evitar bucle de redirección si ya estamos en login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }

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

  async download(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        method: options.method || "GET",
        headers,
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.warn("No se pudo parsear el error binario", parseError);
        }

        const error = new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const blob = await response.blob();
      const headersMap = {};
      response.headers.forEach((value, key) => {
        headersMap[key.toLowerCase()] = value;
      });

      return { blob, status: response.status, headers: headersMap };
    } catch (error) {
      console.error("Binary download failed:", error);
      throw error;
    }
  }
}

// Exportar una instancia única del cliente API
export const apiClient = new ApiClient();
