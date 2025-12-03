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
    // Build query params
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ""}`;

    const { data } = await apiClient.get(endpoint);

    // Ensure we return an array with default client structure
    const orders = Array.isArray(data) ? data : [];
    return orders.map((order) => ({
      ...order,
      cliente: order.cliente || { nombre: "Cliente Desconocido", correo: "" },
    }));
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
