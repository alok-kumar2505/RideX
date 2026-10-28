import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCaptain(response.data.captain);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching captain profile:", error);
        setIsLoading(false);
        localStorage.removeItem("token");
        navigate("/captain-login");
      });
  }, [token, navigate, setCaptain]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <i className="ri-loader-4-line animate-spin text-4xl text-emerald-600"></i>
        <p className="text-gray-500 font-medium text-sm mt-3">
          Loading captain dashboard...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
