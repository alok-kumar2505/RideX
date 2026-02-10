import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div className="h-[70%]">
      <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={() => {
        props.setWaitingForDriver(false);
        
      }}>
        {" "}
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

        <div className="flex items-center justify-between">
          <img className="h-24" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"/>

          <div className="text-right">
            <h2 className="text-lg font-medium">Alok</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">BR05 AV 1933</h4>
            <p className="text-sm text-gray-600">Maruti Suzuti alto</p>
          </div>
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
      </div>
    </div>
  );
};

export default WaitingForDriver;
