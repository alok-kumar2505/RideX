import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import logo from "../assets/image.png";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({});
  const Navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser
    );
    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);

      Navigate("/home");
    }
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white md:bg-gray-100">
      <div className="p-7 flex flex-col h-screen md:h-auto md:min-h-[620px] md:max-w-md w-full justify-between bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200">
        <div>
          <img className="w-16 mb-10" src={logo} alt="RideX Logo" />
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h3 className="text-lg font-medium mb-2">What's your name</h3>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
                className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base outline-none"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
                className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base outline-none"
              />
            </div>

            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="px-4 py-2 rounded border bg-[#eeeeee] w-full text-lg placeholder:text-base mb-6 outline-none"
            />
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
              className="px-4 py-2 rounded border bg-[#eeeeee] w-full text-lg placeholder:text-base mb-6 outline-none"
            />
            <button className="bg-[#111] text-white font-semibold px-4 py-2 rounded mb-3 w-full text-lg cursor-pointer">
              Create Account
            </button>
          </form>
          <p className="text-center text-md">
            Already have an account ?{" "}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>

        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
