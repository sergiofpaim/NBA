import React, { createContext, useContext, ReactNode } from 'react';
import { api } from './Api';

const ApiContext = createContext(api);

interface UtilsProviderProps {
    children: ReactNode;
}

export const UtilProvider: React.FC<UtilsProviderProps> = ({ children }) => {
    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};