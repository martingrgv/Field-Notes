import { createContext, useContext, ReactNode } from 'react';
import { useCategories } from '../hooks/useCategories';

interface CategoryContextType {
    categories: string[];
    loading: boolean;
    error: string | null;
    refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
    children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
    const categoriesData = useCategories();

    return (
        <CategoryContext.Provider value={categoriesData}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategoryContext() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
}