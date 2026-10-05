import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUser,
} from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      setUser(data.user);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Login failed"
      );
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      await registerUser(payload);
      await login({
        username: payload.username,
        password: payload.password,
      });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Registration failed"
      );
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Logout failed"
      );
      throw err;
    }
  };

  const updateProfile = async (payload) => {
    try {
      const data = await updateCurrentUser(payload);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Profile update failed"
      );
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
