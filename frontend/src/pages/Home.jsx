import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css' 
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const PanelCloseRef=useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    setPickupLocation("");
    setDestination("");
  };

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding:24, 
      });
      gsap.to(PanelCloseRef.current, {
        opacity: 1});
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: "0px",
      });
      gsap.to(PanelCloseRef.current, {
        opacity: 0});
    }
  }, [panelOpen]);

  return (
    <div className="h-screen relative">
      <img
        className="w-18 absolute left-6 top-6"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
      />

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover "
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className="h-[30%] p-6 bg-white relative">
          <h5 ref={PanelCloseRef} className="absolute top-6 right-6 text-2xl font-semibold" onClick={()=>{setPanelOpen(false)}}><i className="ri-arrow-down-wide-fill"></i></h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute bg-gray-900 w-1 h-16 top-[42%] left-12 rounded-full"></div>
            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pick-up location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              onClick={() => {
                setPanelOpen(true);
              }}
            />
            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onClick={() => {
                setPanelOpen(true);
              }}
            />
          </form>
        </div>
        <div ref={panelRef} className=" bg-white  h-0">
          <LocationSearchPanel/>
        </div>
      </div>
    </div>
  );
};

export default Home;
