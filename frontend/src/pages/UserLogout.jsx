import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "../context/ToastContext";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          toast.success("Logged out successfully");
          navigate("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <i className="ri-loader-4-line animate-spin text-3xl text-gray-700"></i>
        <p className="text-gray-600 font-medium">Signing you out...</p>
      </div>
    </div>
  );
};

export default UserLogout;
