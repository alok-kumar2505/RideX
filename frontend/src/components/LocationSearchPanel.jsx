import React from "react";

const LocationSearchPanel = (props) => {
  const locations = [
    "24B, Near Kapoor's cafe, Sheryians Coding School, Bhopal",
    "22B, Near Malholtra's cafe, Sheryians Coding School, Bhopal",
    "20B, Near Singhai's cafe, Sheryians Coding School, Bhopal",
    "Near Sharma's cafe, Sheryians Coding School, Bhopal",
  ];
  return (
    <div>
      {locations.map((el,idx) => (
        <div key={idx} onClick={()=>{props.setVehiclePanel(true); props.setPanelOpen(false);}} className=" flex gap-3 border-2 p-3 items-center mb-2 rounded-lg border-gray-100 active:border-black justify-start">
          <h2 className="bg-[#eee] h-8 w-12 rounded-full items-center flex justify-center">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">
            {el}
          </h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
