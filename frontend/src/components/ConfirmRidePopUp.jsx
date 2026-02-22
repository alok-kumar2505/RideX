import React, { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmRidePopUp = (props) => {

  const [otp, setOtp] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  }
  return (
    <div>
      <h5
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        {" "}
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to start
      </h3>
      <div className="flex items-center justify-between p-2  rounded-lg mt-4 border-2 border-amber-300 py-2.5">
        <div className="flex items-center gap-3   ">
          <img
            className="h-12 w-12 rounded-full object-cover "
            src="https://cdn.create.vista.com/api/media/small/64961499/stock-photo-beautiful-young-woman-selfie-in-the-park"
          />
          <h2 className="text-lg font-medium">Maria kane</h2>
        </div>
        <h5 className="text-lg font-semibold">3.2km</h5>
      </div>
      <div className="flex flex-col  items-center p-2 ">
        <div className="w-full">
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-gray-600 text-sm -mt-1">
                Kankariya Talab, Ahemdabad
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-gray-600 text-sm -mt-1">
                Kankariya Talab, Ahemdabad
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 px-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹193</h3>

              <p className="text-gray-600 text-sm -mt-1">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-[#eee] px-6 py-3 font-mono text-lg rounded-lg w-full my-3 text-center"
              type="text"
              placeholder="Enter OTP"
            />
            <Link
              to="/captain-riding"
              className="w-full flex justify-center bg-green-600 rounded-lg text-white p-3 font-semibold text-center"
            >
              Confirm
            </Link>
            <button
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
              }}
              className="w-full bg-red-500 rounded-lg text-white p-3 mt-4 font-semibold"
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
