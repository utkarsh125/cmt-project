// Auth utilities for handling JWT tokens and user state
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthResponse {
    token: string;
    user: User;
    message: string;
}

// Store token in localStorage
export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
};

// Get token from localStorage
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Remove token from localStorage
export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
};

// Store user data
export const setUser = (user: User) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

// Get user data
export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
    }
    return null;
};

// Check if user is admin
export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role === 'ADMIN';
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

// Logout
export const logout = () => {
    removeAuthToken();
};
