import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import driverlogo from "../assets/driver.png";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  useGSAP(() => {
    if (finishRidePanelRef.current) {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row relative overflow-hidden bg-white">
      {/* =========================================================================
          DESKTOP / LAPTOP SIDEBAR (md:flex)
          ========================================================================= */}
      <div className="hidden md:flex md:w-[440px] lg:w-[480px] h-screen bg-white border-r border-gray-200 shadow-2xl flex-col justify-between p-6 z-20 shrink-0">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <Link to="/captain-home">
            <img className="w-16 object-contain" src={driverlogo} alt="Driver Logo" />
          </Link>
          <Link
            to="/captain-home"
            className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <i className="ri-close-line mr-1 text-base"></i>
            Exit
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          {finishRidePanel ? (
            <FinishRide
              rideData={rideData}
              setFinishRidePanel={setFinishRidePanel}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-400 p-6 rounded-2xl shadow-sm text-center">
                <i className="text-4xl text-gray-800 ri-navigation-fill mb-2"></i>
                <h4 className="text-2xl font-bold text-gray-900">4 km away</h4>
                <p className="text-sm text-gray-800 mt-1">Heading to Destination</p>
                <p className="text-xs font-semibold text-gray-900 mt-2 bg-yellow-300 py-1 px-3 rounded-lg truncate">
                  {rideData?.destination || "Destination"}
                </p>
              </div>

              <button
                onClick={() => setFinishRidePanel(true)}
                className="w-full bg-green-600 hover:bg-green-700 p-3.5 rounded-xl text-white font-semibold text-lg cursor-pointer transition shadow-md"
              >
                Complete Ride
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAP AREA (Full width on mobile top, right side on desktop)
          ========================================================================= */}
      <div className="flex-1 h-4/5 md:h-full relative z-0">
        <div className="md:hidden fixed p-3 top-0 flex items-center justify-between w-full z-10 pointer-events-none">
          <img className="w-16 pointer-events-auto" src={driverlogo} alt="Driver Logo" />
          <Link
            to="/home"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md pointer-events-auto"
          >
            <i className="text-lg font-bold ri-logout-box-r-line"></i>
          </Link>
        </div>

        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Captain navigation"
        />
      </div>

      {/* =========================================================================
          MOBILE-ONLY BOTTOM BAR & SLIDING FINISH PANEL (< md)
          ========================================================================= */}
      <div
        onClick={() => setFinishRidePanel(true)}
        className="md:hidden h-1/5 p-6 flex justify-between items-center bg-yellow-400 relative cursor-pointer"
      >
        <h5 className="p-1 text-center w-[95%] absolute top-0">
          <i className="text-3xl text-gray-400 ri-arrow-up-wide-fill"></i>
        </h5>

        <h4 className="text-xl font-semibold">4 km away</h4>
        <button className="bg-green-600 px-10 p-3 rounded-lg text-white font-semibold cursor-pointer">
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="md:hidden fixed w-full h-[84%] z-20 bottom-0 px-3 py-10 translate-y-full bg-white pt-12 overflow-y-auto"
      >
        <FinishRide
          rideData={rideData}
          setFinishRidePanel={setFinishRidePanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;
