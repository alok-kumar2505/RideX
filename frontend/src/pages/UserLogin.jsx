import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import logo from "../assets/image.png";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState("");

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const formSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData
    );

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white md:bg-gray-100">
      <div className="p-7 flex flex-col h-screen md:h-auto md:min-h-[580px] md:max-w-md w-full justify-between bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200">
        <div>
          <img
            className="w-18 mb-10 scale-[1.2] object-contain"
            src={logo}
            alt="RideX Logo"
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
            New Here?{" "}
            <Link to="/signup" className="text-blue-600">
              Create New Account
            </Link>
          </p>
        </div>

        <div>
          <Link
            to="/captain-login"
            className="bg-[#10b461] flex items-center justify-center text-white font-semibold px-4 py-2 rounded mb-5 w-full text-lg cursor-pointer"
          >
            Login as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
