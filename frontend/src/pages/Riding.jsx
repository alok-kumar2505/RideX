import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";
import logo from "../assets/image.png";

const Riding = () => {
  const location = useLocation();
  const { socket } = useContext(SocketContext);
  const { ride } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    socket.on("ride-ended", () => {
      navigate("/home");
    });
    return () => {
      socket.off("ride-ended");
    };
  }, [socket, navigate]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row relative overflow-hidden bg-white">
      {/* Home Button for Mobile */}
      <Link
        to="/home"
        className="md:hidden fixed h-10 w-10 bg-white flex items-center justify-center rounded-full top-3 left-5 z-30 shadow-md"
      >
        <i className="text-lg font-bold ri-home-5-line"></i>
      </Link>

      {/* =========================================================================
          DESKTOP / LAPTOP SIDEBAR (md:flex)
          ========================================================================= */}
      <div className="hidden md:flex md:w-[440px] lg:w-[480px] h-screen bg-white border-r border-gray-200 shadow-2xl flex-col justify-between p-6 z-20 shrink-0">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <Link to="/home">
              <img className="w-20 object-contain" src={logo} alt="RideX Logo" />
            </Link>
            <Link
              to="/home"
              className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <i className="ri-home-5-line mr-1"></i>
              Home
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <img
              className="h-24 object-contain"
              src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"
              alt="Ride Vehicle"
            />
            <div className="text-right">
              <h2 className="text-xl font-bold capitalize text-gray-900">
                {ride?.captain?.fullname?.firstname}
              </h2>
              <h4 className="text-lg font-semibold uppercase text-gray-700">
                {ride?.captain?.vehicle?.plate}
              </h4>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 border-b-2 border-gray-200 p-2">
              <i className="text-xl ri-map-pin-fill text-gray-700"></i>
              <div>
                <h3 className="text-lg font-medium">{ride?.destination}</h3>
              </div>
            </div>

            <div className="flex items-center space-x-3 px-2">
              <i className="text-xl ri-currency-line text-gray-700"></i>
              <div>
                <h3 className="text-xl font-bold">₹{ride?.fare}</h3>
                <p className="text-gray-600 text-sm">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 rounded-lg text-white p-3 font-semibold text-lg cursor-pointer transition shadow-md">
          Make a payment
        </button>
      </div>

      {/* =========================================================================
          MAP AREA (Full width on mobile top-half, right side on desktop)
          ========================================================================= */}
      <div className="flex-1 h-1/2 md:h-full relative z-0">
        <LiveTracking />
      </div>

      {/* =========================================================================
          MOBILE-ONLY DETAILS (Bottom Half on < md)
          ========================================================================= */}
      <div className="md:hidden h-1/2 p-4 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <img
              className="h-24"
              src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"
              alt="Ride Vehicle"
            />
            <div className="text-right">
              <h2 className="text-lg font-medium capitalize">
                {ride?.captain?.fullname?.firstname}
              </h2>
              <h4 className="text-xl font-semibold -mt-1 -mb-1 uppercase">
                {ride?.captain?.vehicle?.plate}
              </h4>
            </div>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-full">
              <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
                <i className="text-lg ri-map-pin-fill"></i>
                <div>
                  <h3 className="text-lg font-medium">{ride?.destination}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-3 px-2">
                <i className="text-lg ri-currency-line"></i>
                <div>
                  <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                  <p className="text-gray-600 text-sm -mt-1">Cash Cash</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full bg-green-600 rounded-lg text-white p-2 font-semibold mt-2 cursor-pointer">
          Make a payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
