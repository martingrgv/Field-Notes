import { useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const LAST_VISITED_KEY = 'field-notes-last-visited';

export const useLastVisited = () => {
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname + location.search;
        if (currentPath !== '/') {
            localStorage.setItem(LAST_VISITED_KEY, currentPath);
        }
    }, [location.pathname, location.search]);

    const getLastVisited = useCallback((): string | null => {
        return localStorage.getItem(LAST_VISITED_KEY);
    }, []);

    const clearLastVisited = useCallback(() => {
        localStorage.removeItem(LAST_VISITED_KEY);
    }, []);

    return useMemo(() => ({
        getLastVisited,
        clearLastVisited
    }), [getLastVisited, clearLastVisited]);
};