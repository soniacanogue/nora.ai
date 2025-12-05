import { useState, useMemo } from 'react';

/**
 * Hook to handle dynamic search and filtering.
 * @param {Array} data - The dataset to search.
 * @param {Object} config - Configuration object.
 * @param {Array<string>} config.searchKeys - List of keys to search in (supports dot notation).
 * @returns {Object} { searchTerm, setSearchTerm, filteredData, suggestions }
 */
export const useDynamicSearch = (data = [], config = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchKeys = [] } = config;

  // Helper to get nested values safely
  const getValue = (obj, path) => {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
  };

  const suggestions = useMemo(() => {
    if (!data || !searchKeys.length) return [];
    const s = new Set();
    data.forEach(item => {
      searchKeys.forEach(key => {
        const val = getValue(item, key);
        if (val !== null && val !== undefined && val !== "") {
          s.add(String(val));
        }
      });
    });
    return Array.from(s);
  }, [data, searchKeys]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lowerTerm = searchTerm.toLowerCase();
    
    return data.filter(item => {
      return searchKeys.some(key => {
        const val = getValue(item, key);
        return String(val || '').toLowerCase().includes(lowerTerm);
      });
    });
  }, [data, searchTerm, searchKeys]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    suggestions
  };
};
