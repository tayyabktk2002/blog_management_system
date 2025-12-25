"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      const responsData = res.data.data;
      localStorage.setItem("token", responsData.token);
      localStorage.setItem("user", JSON.stringify(responsData));
      setUser(responsData);
      router.push("/");
      toast.success("Login successful!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const register = async (data) => {
    try {
      await api.post("/auth/register", data);
      toast.info("Registration successful!, now login your account");
      router.push("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  const createBlog = async (data) => {
    try {
      const res = await api.post("/post/create", data);
      toast.success("Blog created successfully!");
      router.push(`/user-blog`);
      return res;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create blog. Please try again."
      );
      throw err;
    }
  };

  const removeBlog = async (id) => {
    try {
      const res = await api.delete(`/post/remove/${id}`);
      const responsData = res.data.data;
      toast.success("Blog deleted successfully!");
      return responsData;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete blog. Please try again."
      );
    }
  };

  const updateBlog = async (id, data) => {
    try {
      const res = await api.put(`/post/update/${id}`, data);
      const responsData = res.data.data;
      toast.success("Blog updated successfully!");
      router.push(`/user-blog`);
      return responsData;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update blog. Please try again."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuth: !!user, loading, createBlog, removeBlog, updateBlog}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
