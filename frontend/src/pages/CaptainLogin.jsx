import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import { toast } from "../context/ToastContext";
import driverlogo from "../assets/driver.png";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const formSubmit = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captain
      );
      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        toast.success("Captain login successful!");
        navigate("/captain-home");
      }
    } catch (err) {
      console.error("Captain Login Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Invalid captain credentials. Please try again.";
      toast.error(errorMsg);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white md:bg-gray-100">
      <div className="p-7 flex flex-col h-screen md:h-auto md:min-h-[580px] md:max-w-md w-full justify-between bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200">
        <div>
          <img
            className="w-18 mb-4 mt-4"
            src={driverlogo}
            alt="Driver Logo"
          />
          <form
            onSubmit={(e) => {
              formSubmit(e);
            }}
          >
            <h3 className="text-lg font-medium mb-3">What's your email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="px-4 py-2 rounded border bg-[#eeeeee] w-full text-lg placeholder:text-sm mb-3 outline-none"
            />
            <h3 className="text-lg font-medium mb-3">Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
              className="px-4 py-2 rounded border bg-[#eeeeee] w-full text-lg placeholder:text-sm mb-3 outline-none"
            />
            <button className="bg-[#111] text-white font-semibold px-4 py-2 rounded mb-3 w-full text-lg cursor-pointer">
              Login
            </button>
          </form>
          <p className="text-center">
            Join a fleet?{" "}
            <Link to="/captain-signup" className="text-blue-600">
              Register as a captain
            </Link>
          </p>
        </div>

        <div>
          <Link
            to="/login"
            className="mt-6 bg-[#d5622d] flex items-center justify-center text-white font-semibold px-4 py-2 rounded mb-5 w-full text-lg cursor-pointer"
          >
            Login as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
