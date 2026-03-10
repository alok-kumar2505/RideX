import React from "react";
import { Link,useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import FinishRide from "../components/FinishRide";


const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
    const location = useLocation();
    const rideData = location.state?.ride;
  

   useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePanel]);
  return (
    <div className="h-screen relative">
      <div className="fixed p-3 top-0 flex items-center justify-between w-screen ">
        <img
          className="w-18"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        />
        <Link
          to="/home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full "
        >
          <i className="text-lg font-bold ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        />
      </div>


      <div onClick={() => setFinishRidePanel(true)} className="h-1/5 p-6 flex justify-between items-center bg-yellow-400 relative">
      <h5
          
          className="p-1 text-center w-[95%] absolute top-0 "
        >
          {" "}
          <i className="text-3xl text-gray-400 ri-arrow-up-wide-fill"></i>
        </h5>
        
        <h4 className="text-xl font-semibold">4 km away</h4>
        <button className=" bg-green-600 px-10 p-3  rounded-lg text-white  font-semibold">
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}

        className=" fixed w-full h-[84%]
         z-20 bottom-0 px-3 py-10  translate-y-full bg-white pt-12"
      >
        <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel}/>
      </div>
    </div>
  );
};

export default CaptainRiding;
