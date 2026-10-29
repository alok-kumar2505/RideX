import React from "react";

const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setVehiclePanel(false);
          props.setPanelOpen(true);
        }}
        className="p-1 text-center w-full absolute top-0 cursor-pointer md:hidden"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      {/* Large Screen Back Arrow */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => {
            props.setVehiclePanel(false);
            props.setPanelOpen(true);
          }}
          className="hidden md:flex w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 items-center justify-center transition cursor-pointer"
          title="Back"
        >
          <i className="ri-arrow-left-line text-lg font-semibold"></i>
        </button>
        <h3 className="text-xl font-semibold">Choose a ride</h3>
      </div>
      <div
        onClick={() => {
          props.selectVehicle("car");
          props.setConfirmRidePanel(true);
          props.setVehiclePanel(false);
        }}
        className="flex w-full items-center justify-between p-3 border-2 border-gray-200 active:border-black rounded-lg mb-1 cursor-pointer"
      >
        <img
          className="h-14"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"
          alt="UberGo"
        />
        <div className="ml-8 w-1/2">
          <h4 className="font-medium text-base">
            UberGo
            <span className="ml-2">
              <i className="ri-user-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away</h5>
          <p className="text-xs text-gray-500 font-normal">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare?.car || 0}</h2>
      </div>

      <div
        onClick={() => {
          props.selectVehicle("bike");
          props.setConfirmRidePanel(true);
          props.setVehiclePanel(false);
        }}
        className="flex w-full items-center justify-between p-3 border-2 border-gray-200 active:border-black rounded-lg mb-1 cursor-pointer"
      >
        <img
          className="h-12"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n"
          alt="Moto"
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            Moto
            <span className="ml-2">
              <i className="ri-user-fill"></i>1
            </span>
          </h4>
          <h5 className="font-medium text-sm">3 mins away</h5>
          <p className="text-xs text-gray-500 font-normal whitespace-nowrap">
            Affordable motorcycle rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare?.bike || 0}</h2>
      </div>

      <div
        onClick={() => {
          props.selectVehicle("auto");
          props.setConfirmRidePanel(true);
          props.setVehiclePanel(false);
        }}
        className="flex w-full items-center justify-between p-3 border-2 border-gray-200 active:border-black rounded-lg cursor-pointer"
      >
        <img
          className="h-12"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
          alt="UberAuto"
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberAuto
            <span className="ml-2">
              <i className="ri-user-fill"></i>3
            </span>
          </h4>
          <h5 className="font-medium text-sm">3 mins away</h5>
          <p className="text-xs text-gray-500 font-normal whitespace-nowrap">
            Affordable auto rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare?.auto || 0}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
