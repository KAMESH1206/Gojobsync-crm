import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';

interface UseDataStoreOptions<T> {
  endpoint: string;
  initialData?: T[];
  autoFetch?: boolean;
}

export function useDataStore<T extends { id: string }>(options: UseDataStoreOptions<T>) {
  const { endpoint, initialData = [], autoFetch = true } = options;
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchItems = useCallback(async (queryParams = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      showToast(err.message || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  }, [endpoint, showToast]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch, fetchItems]);

  const createItem = async (newItemData: Partial<T>): Promise<T | null> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.errors?.join(', ') || 'Failed to create item');
      }

      const createdItem = await response.json();
      setData(prev => [createdItem, ...prev]);
      showToast('Successfully created', 'success');
      return createdItem;
    } catch (err: any) {
      showToast(err.message || 'Failed to create item', 'error');
      return null;
    }
  };

  const updateItem = async (id: string, updateData: Partial<T>): Promise<T | null> => {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.errors?.join(', ') || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setData(prev => prev.map(item => (item.id === id ? updatedItem : item)));
      showToast('Successfully updated', 'success');
      return updatedItem;
    } catch (err: any) {
      showToast(err.message || 'Failed to update item', 'error');
      return null;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }

      setData(prev => prev.filter(item => item.id !== id));
      showToast('Successfully deleted', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
