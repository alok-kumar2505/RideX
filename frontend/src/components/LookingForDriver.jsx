import React from "react";

const LookingForDriver = (props) => {
  return (
    <div className="h-[70%]">
      <h5
        onClick={() => {
          props.setVehicleFound(false);
          props.setConfirmRidePanel(true);
        }}
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-xl font-semibold text-center">
        Looking for a driver...
      </h3>
      <div className="flex flex-col items-center p-2">
        <img
          className="h-22"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"
          alt="Looking for driver"
        />

        <div className="w-full">
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <p className="text-gray-600 text-sm -mt-1 font-semibold">
                {props.pickupLocation}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-fill"></i>
            <div>
              <p className="text-gray-600 text-sm -mt-1 font-semibold">
                {props.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 px-2">
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{props.fare?.[props.vehicleType] || 0}
              </h3>
              <p className="text-gray-600 text-sm -mt-1">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
