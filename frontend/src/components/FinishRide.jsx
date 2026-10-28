import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../context/ToastContext";

const FinishRide = (props) => {
  const navigate = useNavigate();

  async function endRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: props.rideData?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Ride completed successfully!");
        navigate("/captain-home");
        if (props.setFinishRidePanel) {
          props.setFinishRidePanel(false);
        }
      }
    } catch (error) {
      console.error("Error ending ride:", error);
      toast.error(
        error?.response?.data?.message || "Failed to complete ride."
      );
    }
  }

  return (
    <div>
      <h5
        onClick={() => {
          if (props.setFinishRidePanel) {
            props.setFinishRidePanel(false);
          } else if (props.setConfirmRide) {
            props.setConfirmRide(false);
          }
        }}
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold mt-3">Finish this Ride</h3>
      <div className="flex items-center justify-between p-2 border-2 border-yellow-300 rounded-lg mt-4">
        <div className="flex items-center gap-3 py-2">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://cdn.create.vista.com/api/media/small/64961499/stock-photo-beautiful-young-woman-selfie-in-the-park"
            alt="User"
          />
          <h2 className="text-lg font-medium capitalize">
            {props.rideData?.user?.fullname?.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">3.2km</h5>
      </div>
      <div className="flex flex-col items-center p-2">
        <div className="w-full">
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{props.rideData?.pickup}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              <h3 className="text-lg font-medium">
                {props.rideData?.destination}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 px-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.rideData?.fare}</h3>
              <p className="text-gray-600 text-sm -mt-1">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <button
            onClick={endRide}
            className="w-full text-lg flex justify-center bg-green-600 rounded-lg text-white p-3 font-semibold text-center cursor-pointer"
          >
            Finish Ride
          </button>
          <p className="text-center mt-2 text-xs text-gray-400">
            Click on Finish Ride if you have completed the ride.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
