// src/features/orders/hooks/useOrder.js
import { useState, useEffect } from "react";
import { getOrderById } from "../api/ordersApi";

/**
 * A hook to fetch the details of a specific order by its ID.
 * @param {string} orderId - The ID of the order to fetch.
 * @returns {{order: object|null, isLoading: boolean, error: string|null}}
 */
export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, isLoading, error };
};
