// src/features/orders/hooks/useOrders.js
import { useState, useEffect } from "react";
import { getOrders } from "../api/ordersApi";

/**
 * A hook to fetch and manage a list of orders.
 * @returns {{orders: Array, isLoading: boolean, error: string|null}}
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
};
