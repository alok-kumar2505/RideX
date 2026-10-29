import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import { toast } from "../context/ToastContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import driverlogo from "../assets/driver.png";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const [ride, setRide] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const navigate = useNavigate();

  const captainRef = useRef(captain);
  useEffect(() => {
    captainRef.current = captain;
  }, [captain]);

  useEffect(() => {
    const fetchCaptainProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data?.captain) {
          setCaptain(response.data.captain);
        }
      } catch (err) {
        console.error("Error refreshing captain profile:", err);
      }
    };

    fetchCaptainProfile();
  }, [setCaptain]);

  const handleCaptainLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/captain-login");
  };

  useEffect(() => {
    if (!captain?._id || !socket) {
      return;
    }

    const emitJoin = () => {
      console.log("🔌 Emitting join for captain:", captain._id);
      socket.emit("join", { userId: captain._id, userType: "captain" });
    };

    if (socket.connected) {
      emitJoin();
    }
    socket.on("connect", emitJoin);

    const updateLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (err) => {
          console.warn("Geolocation warning in CaptainHome:", err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => {
      socket.off("connect", emitJoin);
      clearInterval(locationInterval);
    };
  }, [captain?._id, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      setRide(data);
      setRidePopupPanel(true);
      toast.info("New ride request received!");
    };

    const handleRideCancelled = (data) => {
      console.log("🚫 Received ride-cancelled event:", data);
      setRide((currentRide) => {
        if (!currentRide) return null;
        const cancelledId = data?.rideId || data?.ride?._id;
        if (!cancelledId || currentRide._id === cancelledId) {
          setRidePopupPanel(false);
          setConfirmRidePopupPanel(false);
          toast.info("The rider cancelled this ride request");
          return null;
        }
        return currentRide;
      });
    };

    const handleRideTaken = (data) => {
      console.log("🚕 Received ride-taken event:", data);
      const myCaptainId = captainRef.current?._id?.toString();
      // If this captain accepted the ride, ignore the broadcast so we don't clear our own ride state
      if (
        data?.acceptedByCaptainId &&
        myCaptainId &&
        data.acceptedByCaptainId.toString() === myCaptainId
      ) {
        console.log("🚕 Ignoring ride-taken because this captain accepted it");
        return;
      }

      setRide((currentRide) => {
        if (!currentRide) return null;
        if (currentRide._id === data?.rideId) {
          setRidePopupPanel(false);
          setConfirmRidePopupPanel(false);
          toast.info("Another captain accepted this ride");
          return null;
        }
        return currentRide;
      });
    };

    socket.on("new-ride", handleNewRide);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("ride-taken", handleRideTaken);

    return () => {
      socket.off("new-ride", handleNewRide);
      socket.off("ride-cancelled", handleRideCancelled);
      socket.off("ride-taken", handleRideTaken);
    };
  }, [socket]);

  async function confirmRide() {
    if (!ride?._id) {
      toast.error("No ride request to accept");
      return;
    }
    if (isAccepting) return;
    setIsAccepting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setRide(response.data);
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
        toast.success("Ride accepted!");
      }
    } catch (error) {
      console.error("Error confirming ride:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to accept ride. Please try again.";
      toast.error(errMsg);
      // Dismiss popup and clear ride so captain can receive other requests
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(false);
      setRide(null);
    } finally {
      setIsAccepting(false);
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
            <button
              onClick={handleCaptainLogout}
              className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Logout"
            >
              <i className="ri-logout-box-r-line mr-1"></i>
              Logout
            </button>
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
              isAccepting={isAccepting}
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
          <button
            onClick={handleCaptainLogout}
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md pointer-events-auto cursor-pointer"
            title="Logout"
          >
            <i className="text-lg font-bold ri-logout-box-r-line"></i>
          </button>
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
          isAccepting={isAccepting}
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
