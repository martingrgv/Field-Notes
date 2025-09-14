import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useCategories() {
    const { isAuthenticated, isInitialized } = useAuth();
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!isAuthenticated) {
            setCategories([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await apiService.get('/notes/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const refreshCategories = useCallback(() => {
        if (isAuthenticated) {
            fetchCategories();
        }
    }, [fetchCategories, isAuthenticated]);

    useEffect(() => {
        if (isInitialized) {
            fetchCategories();
        }
    }, [fetchCategories, isInitialized]);

    return {
        categories,
        loading,
        error,
        refreshCategories
    };
}