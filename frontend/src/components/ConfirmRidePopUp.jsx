import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride?._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: props.ride } });
      }
    } catch (err) {
      console.error("Error starting ride:", err);
    }
  };

  return (
    <div>
      <h5
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to start
      </h3>
      <div className="flex items-center justify-between p-2 rounded-lg mt-4 border-2 border-amber-300 py-2.5">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://cdn.create.vista.com/api/media/small/64961499/stock-photo-beautiful-young-woman-selfie-in-the-park"
            alt="User"
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user?.fullname?.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">3.2km</h5>
      </div>
      <div className="flex flex-col items-center p-2">
        <div className="w-full">
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{props.ride?.destination}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 px-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-gray-600 text-sm -mt-1">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <form onSubmit={submitHandler}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-[#eee] px-6 py-3 font-mono text-lg rounded-lg w-full my-3 text-center outline-none"
              type="text"
              placeholder="Enter OTP"
              required
            />
            <button className="w-full flex justify-center bg-green-600 rounded-lg text-white p-3 font-semibold text-center cursor-pointer">
              Confirm
            </button>
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
              }}
              className="w-full bg-red-500 rounded-lg text-white p-3 mt-4 font-semibold cursor-pointer"
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
