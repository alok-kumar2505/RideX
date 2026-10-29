import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "../context/ToastContext";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!props.ride?._id) {
      toast.error("Ride information is missing. Please re-accept the ride.");
      return;
    }

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    if (cleanOtp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride._id,
            otp: cleanOtp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("OTP verified! Ride started.");
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: response.data || props.ride } });
      }
    } catch (err) {
      console.error("Error starting ride:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Invalid OTP. Please check with rider.";
      toast.error(errMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h5
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer md:hidden"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      {/* Large Screen Back Arrow + Title */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => {
            props.setConfirmRidePopupPanel(false);
          }}
          className="hidden md:flex w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 items-center justify-center transition cursor-pointer"
          title="Back"
        >
          <i className="ri-arrow-left-line text-lg font-semibold"></i>
        </button>
        <h3 className="text-2xl font-semibold">
          Confirm this ride to start
        </h3>
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg mt-4 border-2 border-amber-300 py-2.5">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://cdn.create.vista.com/api/media/small/64961499/stock-photo-beautiful-young-woman-selfie-in-the-park"
            alt="User"
          />
          <h2 className="text-lg font-medium capitalize">
            {(props.ride?.user?.fullname?.firstname || "User") +
              (props.ride?.user?.fullname?.lastname
                ? " " + props.ride.user.fullname.lastname
                : "")}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">3.2km</h5>
      </div>
      <div className="flex flex-col items-center p-2">
        <div className="w-full">
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-user-fill text-yellow-600"></i>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Pickup</h3>
              <p className="text-gray-800 text-sm font-medium">
                {props.ride?.pickup || "Pickup location"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-fill text-green-600"></i>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Destination</h3>
              <p className="text-gray-800 text-sm font-medium">
                {props.ride?.destination || "Destination location"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 px-2">
            <i className="text-lg ri-currency-line text-gray-700"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare || 0}</h3>
              <p className="text-gray-600 text-sm -mt-1">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <form onSubmit={submitHandler}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-[#eee] px-6 py-3 font-mono text-lg rounded-lg w-full my-3 text-center outline-none tracking-widest"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              required
            />
            <button
              disabled={isVerifying}
              className="w-full flex justify-center bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white p-3 font-semibold text-center cursor-pointer transition"
            >
              {isVerifying ? "Verifying OTP..." : "Confirm"}
            </button>
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
              }}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg text-white p-3 mt-4 font-semibold cursor-pointer transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
