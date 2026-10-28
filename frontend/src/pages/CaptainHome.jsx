import React, { useRef, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import driverlogo from "../assets/driver.png";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    if (!captain?._id || !socket) {
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
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [captain, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("✅ Ride confirmed:", response.data);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  useGSAP(() => {
    if (ridePopupPanelRef.current) {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [ridePopupPanel]);

  useGSAP(() => {
    if (confirmRidePopupPanelRef.current) {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row relative overflow-hidden bg-white">
      {/* =========================================================================
          DESKTOP / LAPTOP SIDEBAR (md:flex)
          ========================================================================= */}
      <div className="hidden md:flex md:w-[440px] lg:w-[480px] h-screen bg-white border-r border-gray-200 shadow-2xl flex-col z-20 shrink-0">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <img
            className="w-16 object-contain"
            src={driverlogo}
            alt="Driver Logo"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold capitalize text-gray-800">
              {captain?.fullname?.firstname || "Captain"}
            </span>
            <Link
              to="/home"
              className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Logout"
            >
              <i className="ri-logout-box-r-line mr-1"></i>
              Logout
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {confirmRidePopupPanel ? (
            <ConfirmRidePopUp
              ride={ride}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              setRidePopupPanel={setRidePopupPanel}
            />
          ) : ridePopupPanel ? (
            <RidePopUp
              ride={ride}
              setRidePopupPanel={setRidePopupPanel}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              confirmRide={confirmRide}
            />
          ) : (
            <div className="space-y-6">
              <CaptainDetails />
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAP AREA (Full width on mobile, right side on desktop)
          ========================================================================= */}
      <div className="flex-1 h-3/5 md:h-full relative z-0">
        <div className="md:hidden fixed p-3 top-0 flex items-center justify-between w-full z-10 pointer-events-none">
          <img
            className="w-16 pointer-events-auto"
            src={driverlogo}
            alt="Driver Logo"
          />
          <Link
            to="/home"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md pointer-events-auto"
          >
            <i className="text-lg font-bold ri-logout-box-r-line"></i>
          </Link>
        </div>

        <LiveTracking />
      </div>

      {/* =========================================================================
          MOBILE-ONLY DETAILS & SLIDING POPUPS (< md)
          ========================================================================= */}
      <div className="md:hidden h-2/5 p-6 bg-white overflow-y-auto border-t border-gray-100">
        <CaptainDetails />
      </div>

      {/* Mobile Sliding Ride Popup */}
      <div
        ref={ridePopupPanelRef}
        className="md:hidden fixed w-full z-20 bottom-0 px-3 py-10 translate-y-full bg-white pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Mobile Sliding Confirm Ride Popup */}
      <div
        ref={confirmRidePopupPanelRef}
        className="md:hidden fixed w-full h-screen z-20 bottom-0 px-3 py-10 translate-y-full bg-white pt-12"
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
