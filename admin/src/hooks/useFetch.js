/**
 * useFetch Hook
 * Custom hook for fetching data with loading, error, and caching
 * Location: admin/src/hooks/useFetch.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

// Simple cache for fetch results
const fetchCache = new Map();

export const useFetch = (url, options = {}) => {
  const {
    method = 'GET',
    body = null,
    skip = false,
    cache = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    refetchInterval = null,
    onSuccess = null,
    onError = null
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const cacheTimeRef = useRef(null);
  const refetchTimeoutRef = useRef(null);

  /**
   * Fetch data
   */
  const fetchData = useCallback(async () => {
    // Check cache first
    if (cache && fetchCache.has(url) && method === 'GET') {
      const cachedData = fetchCache.get(url);

      if (Date.now() - cachedData.timestamp < cacheTime) {
        setData(cachedData.data);
        setLoading(false);
        return cachedData.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      if (method === 'GET') {
        response = await api.get(url);
      } else if (method === 'POST') {
        response = await api.post(url, body);
      } else if (method === 'PUT') {
        response = await api.put(url, body);
      } else if (method === 'PATCH') {
        response = await api.patch(url, body);
      } else if (method === 'DELETE') {
        response = await api.delete(url);
      }

      // Cache the result
      if (cache && method === 'GET') {
        fetchCache.set(url, {
          data: response,
          timestamp: Date.now()
        });
      }

      setData(response);
      setLoading(false);

      // Call success callback
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching data';
      setError(errorMessage);
      setLoading(false);

      // Call error callback
      if (onError) {
        onError(err);
      }

      throw err;
    }
  }, [url, method, body, cache, cacheTime, onSuccess, onError]);

  /**
   * Refetch data
   */
  const refetch = useCallback(async () => {
    // Clear cache for this URL
    if (cache && fetchCache.has(url)) {
      fetchCache.delete(url);
    }

    return fetchData();
  }, [url, cache, fetchData]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    if (fetchCache.has(url)) {
      fetchCache.delete(url);
    }
  }, [url]);

  /**
   * Clear all cache
   */
  const clearAllCache = useCallback(() => {
    fetchCache.clear();
  }, []);

  // Fetch data on mount or when dependencies change
  useEffect(() => {
    if (skip) {
      return;
    }

    fetchData();

    // Setup refetch interval if specified
    if (refetchInterval) {
      refetchTimeoutRef.current = setInterval(fetchData, refetchInterval);

      return () => {
        if (refetchTimeoutRef.current) {
          clearInterval(refetchTimeoutRef.current);
        }
      };
    }
  }, [url, method, body, skip, refetchInterval, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (refetchTimeoutRef.current) {
        clearInterval(refetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    clearAllCache,
    isLoading: loading,
    isError: !!error
  };
};

/**
 * Hook for pagination
 */
export const usePaginatedFetch = (baseUrl, pageSize = 10, options = {}) => {
  const [page, setPage] = useState(1);
  const [pageSize_, setPageSize] = useState(pageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState([]);

  const url = `${baseUrl}?page=${page}&limit=${pageSize_}`;

  const { data, loading, error, refetch } = useFetch(url, {
    ...options,
    cache: false // Disable cache for paginated data
  });

  // Update data and total pages
  useEffect(() => {
    if (data && data.data) {
      setAllData(data.data);
      setTotalPages(data.totalPages || 1);
    }
  }, [data]);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  return {
    data: allData,
    loading,
    error,
    page,
    pageSize: pageSize_,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    refetch,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Hook for lazy fetch (manual trigger)
 */
export const useLazyFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (url, options = {}) => {
    const { method = 'GET', body = null } = options;

    setLoading(true);
    setError(null);

    try {
      let response;

      if (method === 'GET') {
        response = await api.get(url);
      } else if (method === 'POST') {
        response = await api.post(url, body);
      } else if (method === 'PUT') {
        response = await api.put(url, body);
      } else if (method === 'PATCH') {
        response = await api.patch(url, body);
      } else if (method === 'DELETE') {
        response = await api.delete(url);
      }

      setData(response);
      setLoading(false);

      return response;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);

      throw err;
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetch,
    isLoading: loading,
    isError: !!error
  };
};

export default useFetch;    