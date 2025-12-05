// src/features/orders/hooks/useOrders.js
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/ordersApi";

/**
 * A hook to fetch and manage a list of orders.
 * @returns {{orders: Array, isLoading: boolean, error: string|null}}
 */
export const useOrders = (filters = {}) => {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getOrders(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { orders, isLoading, error: error ? error.message : null };
};
