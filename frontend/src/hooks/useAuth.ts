import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import type { User } from '../types';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      try {
        const userProfile = await ApiService.getUserProfile();
        setUser(userProfile);
      } catch (apiError) {
        // If backend not available, use mock user data
        console.log('Backend not available, using mock user data');
        setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Customer',
          phone: '(555) 123-4567',
          company: 'Solar Solutions Inc',
          street: '123 Main Street',
          city: 'Dallas',
          state: 'TX',
          zip: '75001',
        });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      // If fetching profile fails (e.g., invalid token), logout
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const response = await ApiService.loginUser(credentials);
    const { token } = response;
    localStorage.setItem('token', token);
    // Fetch the user profile after login
    await fetchUserProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return { user, login, logout, refreshUser, isLoading, error };
};

export default useAuth;
