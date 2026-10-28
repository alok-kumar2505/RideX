import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { toast } from "../context/ToastContext";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        toast.success("Captain registration successful! Welcome to the fleet.");
        navigate("/captain-home");
      }
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
    } catch (error) {
      console.error("Full Error:", error);
      let errorMsg = "Registration failed. Please check your information.";
      if (error.response?.data?.errors) {
        errorMsg = error.response.data.errors
          .map((err) => err.msg)
          .join(". ");
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white md:bg-gray-100">
      <div className="py-5 px-5 flex flex-col h-screen md:h-auto md:max-w-md w-full justify-between bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200 md:my-8">
        <div>
          <img
            className="w-18 mb-4"
            src="https://staging.svgrepo.com/show/505031/uber-driver.svg"
            alt="Captain Driver Logo"
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

            <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                required
                placeholder="Vehicle Color"
                className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base outline-none"
              />
              <input
                type="number"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                required
                placeholder="Capacity"
                className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base outline-none"
              />
            </div>
            <div className="flex gap-2 mb-6 items-center">
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                required
                placeholder="Vehicle Plate"
                className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base outline-none"
              />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
                className="px-4 py-2 rounded border bg-[#eeeeee] w-1/2 text-lg placeholder:text-base outline-none"
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                <option value="car">Car</option>
                <option value="motorcycle">Bike</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <button className="bg-[#111] text-white font-semibold px-4 py-2 rounded mb-3 w-full text-lg cursor-pointer">
              Create Account
            </button>
          </form>
          <p className="text-center text-md">
            Already have an account ?{" "}
            <Link to="/captain-login" className="text-blue-600">
              Login as Captain
            </Link>
          </p>
        </div>

        <div className="p-4">
          <p className="text-gray-500 text-[11px] leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
