import React from "react";

const LocationSearchPanel = () => {
  return (
    <div>
      <div className="flex gap-3 items-center mb-4 justify-start">
        <h2 className="bg-[#eee] h-8 w-12 rounded-full items-center flex justify-center">
          <i className="ri-map-pin-fill"></i>
        </h2>
        <h4 className="font-medium">B21, Near Block-34, Lovely Professional University, Punjab</h4>
      </div>
    <div className="flex gap-3 items-center mb-4 justify-start">
        <h2 className="bg-[#eee] h-8 w-12 rounded-full items-center flex justify-center">
            <i className="ri-map-pin-fill"></i>
        </h2>
        <h4 className="font-medium">Chandigarh International Airport, Sector 70, Chandigarh</h4>
    </div>
    <div className="flex gap-3 items-center mb-4 justify-start">
        <h2 className="bg-[#eee] h-8 w-12 rounded-full items-center flex justify-center">
            <i className="ri-map-pin-fill"></i>
        </h2>
        <h4 className="font-medium">Elante Mall, Industrial Area, Chandigarh</h4>
    </div>
    <div className="flex gap-3 items-center mb-4 justify-start">
        <h2 className="bg-[#eee] h-8 w-12 rounded-full items-center flex justify-center">
            <i className="ri-map-pin-fill"></i>
        </h2>
        <h4 className="font-medium">PEC University of Technology, Sector 12, Chandigarh</h4>
    </div>
    </div>
  );
};

export default LocationSearchPanel;
