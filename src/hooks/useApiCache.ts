import { useState, useEffect, useCallback } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in ms
}

interface CacheOptions {
  ttl?: number; // default 5 minutes
  key?: string;
}

export function useApiCache<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ttl = 5 * 60 * 1000, key } = options;
  const cacheKey = key || JSON.stringify(dependencies);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`api-cache-${cacheKey}`);
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        const now = Date.now();

        if (now - entry.timestamp < entry.ttl) {
          return entry.data;
        } else {
          // remove expired cache
          localStorage.removeItem(`api-cache-${cacheKey}`);
        }
      }
    } catch (err) {
      console.warn("Failed to read from cache:", err);
    }
    return null;
  }, [cacheKey]);

  const setCachedData = useCallback(
    (data: T) => {
      try {
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
          ttl,
        };
        localStorage.setItem(`api-cache-${cacheKey}`, JSON.stringify(entry));
      } catch (err) {
        console.warn("Failed to write to cache:", err);
      }
    },
    [cacheKey, ttl]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // fetch fresh data
      const freshData = await fetchFunction();
      setData(freshData);
      setCachedData(freshData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, getCachedData, setCachedData]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(`api-cache-${cacheKey}`);
    } catch (err) {
      console.warn("Failed to clear cache:", err);
    }
  }, [cacheKey]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearCache,
  };
}

// utility to clear all cache - might need this later
export const clearAllApiCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("api-cache-")) {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.warn("Failed to clear all cache:", err);
  }
};
