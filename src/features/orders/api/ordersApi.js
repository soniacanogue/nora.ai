// src/features/orders/api/ordersApi.js
import { apiClient } from "@/shared/lib/apiClient";

/**
 * Fetches a list of orders from the API.
 * @param {object} params - Filtering and pagination parameters.
 * @returns {Promise<Array>}
 */
export const getOrders = async (params = {}) => {
  console.log("Fetching order list with params:", params);

  try {
    // Use apiClient params support and accept paginated response
    const { data } = await apiClient.get(`/orders`, { params });

    // Backend may return either an array or an object { data: [], pagination: {} }
    let arr = [];
    let pagination = null;

    if (Array.isArray(data)) {
      arr = data;
    } else if (data && Array.isArray(data.data)) {
      arr = data.data;
      pagination = data.pagination || null;
    }

    const mapped = arr.map((order) => ({
      ...order,
      cliente: order.cliente || { nombre: "Cliente Desconocido", correo: "" },
    }));

    // Attach pagination info non-enumerable where possible
    try {
      Object.defineProperty(mapped, "pagination", {
        value: pagination,
        enumerable: false,
        writable: false,
      });
    } catch {
      mapped.pagination = pagination;
    }

    return mapped;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

/**
 * Fetches a single order by its ID.
 * @param {string} orderId - The ID of the order to find.
 * @returns {Promise<object|null>}
 */
export const getOrderById = async (orderId) => {
  console.log(`Fetching order data for ID: ${orderId}...`);

  try {
    // Try to get the order directly by ID
    const { data } = await apiClient.get(`/orders/${orderId}`);

    return {
      ...data,
      cliente: data.cliente || { nombre: "Cliente Desconocido", correo: "" },
      tickets: data.tickets || [],
    };
  } catch (error) {
    // If direct endpoint fails, try to get from list and filter
    console.warn(`Direct order fetch failed, trying list filter:`, error);

    try {
      const orders = await getOrders();
      const order = orders.find((o) => o.id === orderId);

      if (!order) {
        return null;
      }

      return {
        ...order,
        cliente: order.cliente || { nombre: "Cliente Desconocido", correo: "" },
        tickets: order.tickets || [],
      };
    } catch (listError) {
      console.error(`Failed to fetch order ${orderId}:`, listError);
      return null;
    }
  }
};
