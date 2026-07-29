import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useSnackbar } from 'notistack';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setCurrentUser(data);
                } catch (error) {
                    localStorage.removeItem('token');
                    console.error("Session token is invalid or expired.");
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

    const handleAuthResponse = (data) => {
        const { token, user } = data;
        localStorage.setItem('token', token);
        setCurrentUser(user);
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        handleAuthResponse(response.data);
    };

    const login = async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        handleAuthResponse(response.data);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        enqueueSnackbar('You have been logged out.', { variant: 'info' });
    };

    const value = { currentUser, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};