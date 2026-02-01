import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      username: { firstName: firstName, lastName: lastName },
      email: email,
      password: password,
    });
    console.log(userData);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 flex flex-col h-screen justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        />
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
              className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base "
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last Name"
              className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base "
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
            className="px-4 py-2 rounded border bg-[#eeeeee] w-full text-lg placeholder:text-base mb-6"
          />
          <h3 className="text-lg font-medium  mb-2">Enter Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password"
            className="px-4 py-2 rounded border bg-[#eeeeee] w-full text-lg placeholder:text-base mb-6"
          />
          <button className=" bg-[#111] text-white font-semibold px-4 py-2 rounded mb-3 w-full text-lg  ">
            Login
          </button>
        </form>
        <p className="text-center text-md">
          Already have an account ?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>

      <div className="p-4">
        <p className="text-gray-500 text-[11px] leading-tight ">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
