import React, { useState, useEffect } from "react";
import { toast } from "../context/ToastContext";

const SEARCH_TIMEOUT_SECONDS = 30;

const LookingForDriver = (props) => {
  const [timeLeft, setTimeLeft] = useState(SEARCH_TIMEOUT_SECONDS);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Countdown timer while searching
  useEffect(() => {
    setTimeLeft(SEARCH_TIMEOUT_SECONDS);
    setIsTimedOut(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimedOut(true);
          toast.error(
            "No captain accepted yet. Please try again or wait a moment."
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setTimeLeft(SEARCH_TIMEOUT_SECONDS);
    setIsTimedOut(false);
    toast.info("Re-dispatching ride to nearby captains...");
    if (props.createRide) {
      try {
        await props.createRide();
      } catch (err) {
        console.error("Retry createRide error:", err);
      }
    }
  };

  const handleCancel = async () => {
    if (props.cancelCurrentRide) {
      await props.cancelCurrentRide();
    } else {
      props.setVehicleFound(false);
      if (props.setConfirmRidePanel) {
        props.setConfirmRidePanel(true);
      } else if (props.setVehiclePanel) {
        props.setVehiclePanel(true);
      }
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h5
          onClick={handleCancel}
          className="p-1 text-center w-[93%] absolute top-0 cursor-pointer md:hidden"
        >
          <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
        </h5>

        {/* Large Screen Back Arrow */}
        <div className="hidden md:flex items-center mb-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition cursor-pointer"
            title="Back"
          >
            <i className="ri-arrow-left-line text-lg font-semibold"></i>
          </button>
        </div>

        {/* Header Status */}
        {isTimedOut ? (
          <div className="text-center pt-2">
            <span className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <i className="ri-time-line text-2xl"></i>
            </span>
            <h3 className="text-xl font-bold text-gray-900">
              No Captain Accepted Yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Captains nearby may be busy with rides right now.
            </p>
          </div>
        ) : (
          <div className="text-center pt-2">
            <h3 className="text-xl font-semibold">Looking for a driver...</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-xs text-gray-500 font-medium">
                Searching nearby captains ({timeLeft}s)
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto mt-2 overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-1000"
                style={{
                  width: `${(timeLeft / SEARCH_TIMEOUT_SECONDS) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center p-2 mt-2">
          <img
            className="h-20 object-contain my-1"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"
            alt="Looking for driver"
          />

          <div className="w-full mt-2">
            <div className="flex items-center space-x-3 mb-2.5 border-b border-gray-200 p-2">
              <i className="text-lg ri-map-pin-user-fill text-gray-700"></i>
              <div className="min-w-0 flex-1">
                <p className="text-gray-800 text-sm font-semibold truncate">
                  {props.pickupLocation}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-2.5 border-b border-gray-200 p-2">
              <i className="text-lg ri-map-pin-fill text-gray-700"></i>
              <div className="min-w-0 flex-1">
                <p className="text-gray-800 text-sm font-semibold truncate">
                  {props.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 px-2">
              <i className="text-lg ri-currency-line text-gray-700"></i>
              <div>
                <h3 className="text-lg font-medium">
                  ₹{props.fare?.[props.vehicleType] || 0}
                </h3>
                <p className="text-gray-500 text-xs">Cash on arrival</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-2 border-t border-gray-100 space-y-2">
        {isTimedOut ? (
          <>
            <button
              onClick={handleRetry}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
            >
              <i className="ri-restart-line text-lg"></i>
              <span>Try Again</span>
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-semibold cursor-pointer transition"
            >
              Cancel Request
            </button>
          </>
        ) : (
          <button
            onClick={handleCancel}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition"
          >
            Cancel Search
          </button>
        )}
      </div>
    </div>
  );
};

export default LookingForDriver;
