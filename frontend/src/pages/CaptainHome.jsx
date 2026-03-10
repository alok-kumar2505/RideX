import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useEffect } from "react";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const [ride,SetRide]=useState(null)
  

  useEffect(() => {
    if (!captain?._id || !socket) {
      console.log('⏳ Waiting for captain or socket...', {captain: !!captain, socket: !!socket});
      return;
    }
        socket.emit("join", { userId: captain._id, userType: "captain" });
    
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("update-location-captain", {
          userId: captain._id,
          location: {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    };
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation(); // Initial location update on component mount

    return () => clearInterval(locationInterval);
  }, []);


    socket.on("new-ride", (data) => {
      console.log("📩 New ride received:", data.user);
      SetRide(data);
      setRidePopupPanel(true);
    });

    async function confirmRide() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
          rideId: ride._id,
          captainId: captain._id
        },{headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }});
        console.log("✅ Ride confirmed:", response.data);
      } catch (error) {
        console.error("Error confirming ride:", error);
      }
    }

  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopupPanel]);

  useGSAP(() => {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen">
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
      <div className="h-3/5">
        <LiveTracking/>
      </div>
      <div className="h-2/5 p-6 ">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className=" fixed w-full
         z-20 bottom-0 px-3 py-10  translate-y-full bg-white pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}

        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className=" fixed w-full h-screen
         z-20 bottom-0 px-3 py-10  translate-y-full bg-white pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
