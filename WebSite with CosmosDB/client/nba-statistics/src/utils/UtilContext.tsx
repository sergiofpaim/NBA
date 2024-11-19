// src/context/ApiContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { api } from './Api';  // Import the singleton instance

// Create the context for the Api instance
const ApiContext = createContext(api);

interface UtilsProviderProps {
    children: ReactNode;
}

// Create a provider component to supply Api to the app
export const UtilProvider: React.FC<UtilsProviderProps> = ({ children }) => {
    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    );
};

// Custom hook to use Api context
export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};
