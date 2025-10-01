import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import type { User } from '../types/User'
import type { AuthContextType } from '../types/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const decodeJWT = useCallback((token: string): User | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const payload = JSON.parse(jsonPayload);
            return {
                id: payload.sub || payload.id,
                username: payload.username,
                email: payload.email,
            };
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        if (token) {
            const userData = decodeJWT(token);
            if (userData) {
                setUser(userData);
                localStorage.setItem('auth_user', JSON.stringify(userData));
            } else {
                // Clear invalid token directly without calling logout to avoid loop
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                setToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setIsInitialized(true);
    }, [token, decodeJWT]);

    const login = useCallback(async (username: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const { token } = data;

            localStorage.setItem('auth_token', token);
            setToken(token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback((): void => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('field-notes-last-visited');
        setToken(null);
        setUser(null);
    }, []);

    const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

    const value: AuthContextType = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
        isInitialized,
    }), [user, token, login, logout, isLoading, isAuthenticated, isInitialized]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
