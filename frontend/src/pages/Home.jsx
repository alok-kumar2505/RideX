import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { toast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import logo from "../assets/image.png";

const Home = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState("pickup");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isPickupLoading, setIsPickupLoading] = useState(false);
  const [isDestinationLoading, setIsDestinationLoading] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const destinationInputRef = useRef(null);
  const destinationInputDesktopRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const PanelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const vehicleFoundRef = useRef(null);

  const waitingForDriverRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", { userId: user._id, userType: "user" });
    }
  }, [user, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("ride-confirmed", (ride) => {
      toast.success("A captain accepted your ride request!");
      setVehicleFound(false);
      setConfirmRidePanel(false);
      setWaitingForDriver(true);
      setRide(ride);
    });

    socket.on("ride-started", (ride) => {
      toast.info("Ride started! Have a safe trip.");
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
    });

    return () => {
      socket.off("ride-confirmed");
      socket.off("ride-started");
    };
  }, [socket, navigate]);

  const fetchFare = async (pickup, destination) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setFare(response.data?.fare || {});
      return true;
    } catch (error) {
      console.error(
        "Error fetching fare:",
        error?.response?.data || error.message
      );
      const exactError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        (error?.response?.status === 500
          ? "Internal server error: Map service failed to calculate route"
          : "Unable to calculate fare for this route. Please check addresses.");
      toast.error(exactError);
      return false;
    }
  };

  const handleFindRide = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!pickupLocation.trim()) {
      toast.error("Please enter a pick-up location");
      setActiveField("pickup");
      setPanelOpen(true);
      return;
    }

    if (!destination.trim()) {
      toast.error("Please enter a destination");
      setActiveField("destination");
      setPanelOpen(true);
      setTimeout(() => {
        if (window.innerWidth >= 768) {
          destinationInputDesktopRef.current?.focus();
        } else {
          destinationInputRef.current?.focus();
        }
      }, 0);
      return;
    }

    const isFareFetched = await fetchFare(pickupLocation, destination);
    if (!isFareFetched) return;

    setPanelOpen(false);
    setVehiclePanel(true);
  };

  useEffect(() => {
    const isPickupField = activeField === "pickup";
    const currentQuery = isPickupField ? pickupLocation : destination;
    const setSuggestions = isPickupField
      ? setPickupSuggestions
      : setDestinationSuggestions;
    const setLoading = isPickupField
      ? setIsPickupLoading
      : setIsDestinationLoading;

    if (!currentQuery.trim()) {
      setSuggestions([]);
      setMapError(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setMapError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: currentQuery },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        const exactError =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          (error?.response?.status === 500
            ? "Internal server error: Map service failed"
            : error.message || "Failed to fetch location suggestions");
        setMapError(exactError);
        toast.error(`Map API Error: ${exactError}`);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pickupLocation, destination, activeField]);

  const activeSuggestions =
    activeField === "pickup" ? pickupSuggestions : destinationSuggestions;
  const isActiveSuggestionsLoading =
    activeField === "pickup" ? isPickupLoading : isDestinationLoading;

  const handleSuggestionSelect = async (locationText) => {
    if (activeField === "pickup") {
      setPickupLocation(locationText);
      setActiveField("destination");

      setTimeout(() => {
        if (window.innerWidth >= 768) {
          destinationInputDesktopRef.current?.focus();
        } else {
          destinationInputRef.current?.focus();
        }
      }, 0);

      return;
    }

    setDestination(locationText);
    const isFareFetched = await fetchFare(pickupLocation, locationText);
    if (!isFareFetched) return;

    setPanelOpen(false);
    setVehiclePanel(true);
  };

  useGSAP(() => {
    if (panelOpen) {
      if (panelRef.current) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
        });
      }
      if (PanelCloseRef.current) {
        gsap.to(PanelCloseRef.current, {
          opacity: 1,
        });
      }
    } else {
      if (panelRef.current) {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: "0px",
        });
      }
      if (PanelCloseRef.current) {
        gsap.to(PanelCloseRef.current, {
          opacity: 0,
        });
      }
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanelRef.current) {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanelRef.current) {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFoundRef.current) {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriverRef.current) {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    }
  }, [waitingForDriver]);

  async function createRide() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickupLocation,
          destination,
          vehicleType,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      toast.success("Ride requested! Searching for nearby captains...");
      return response.data;
    } catch (error) {
      console.error(
        "Error creating ride:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message || "Failed to create ride. Please try again."
      );
      throw error;
    }
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row relative overflow-hidden bg-white">
      {/* =========================================================================
          DESKTOP / LAPTOP SIDEBAR (md:flex)
          ========================================================================= */}
      <div className="hidden md:flex md:w-[440px] lg:w-[480px] h-screen bg-white border-r border-gray-200 shadow-2xl flex-col z-20 shrink-0">
        {/* Top Header on Laptop */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link to="/home">
            <img className="w-20 object-contain" src={logo} alt="RideX Logo" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold capitalize text-gray-800">
              {user?.fullname?.firstname || "Rider"}
            </span>
            <Link
              to="/users/logout"
              className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Logout"
            >
              <i className="ri-logout-box-r-line mr-1"></i>
              Logout
            </Link>
          </div>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {waitingForDriver ? (
            <WaitingForDriver
              ride={ride}
              vehicleType={vehicleType}
              setWaitingForDriver={setWaitingForDriver}
            />
          ) : vehicleFound ? (
            <LookingForDriver
              vehicleType={vehicleType}
              fare={fare}
              pickupLocation={pickupLocation}
              destination={destination}
              setVehicleFound={setVehicleFound}
              setConfirmRidePanel={setConfirmRidePanel}
            />
          ) : confirmRidePanel ? (
            <ConfirmRide
              vehicleType={vehicleType}
              fare={fare}
              pickupLocation={pickupLocation}
              destination={destination}
              createRide={createRide}
              setConfirmRidePanel={setConfirmRidePanel}
              setVehiclePanel={setVehiclePanel}
              setVehicleFound={setVehicleFound}
            />
          ) : vehiclePanel ? (
            <VehiclePanel
              selectVehicle={setVehicleType}
              fare={fare}
              setPanelOpen={setPanelOpen}
              setVehiclePanel={setVehiclePanel}
              setConfirmRidePanel={setConfirmRidePanel}
            />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-2xl font-bold">Find a trip</h4>
                {panelOpen && (
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="text-gray-400 hover:text-black text-xl p-1 cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                )}
              </div>

              <form onSubmit={handleFindRide} className="relative">
                <div className="line absolute bg-gray-900 w-1 h-14 top-[22px] left-[18px] rounded-full z-10 pointer-events-none"></div>

                <div className="relative mb-3">
                  <input
                    id="pickupLocation-desktop"
                    name="pickupLocation"
                    className="bg-[#eee] pl-10 pr-4 py-3 text-base rounded-lg w-full outline-none"
                    type="text"
                    placeholder="Add a pick-up location"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setPanelOpen(true);
                      setActiveField("pickup");
                    }}
                    onClick={() => {
                      setPanelOpen(true);
                      setActiveField("pickup");
                    }}
                  />
                </div>

                <div className="relative">
                  <input
                    id="destination-desktop"
                    name="destination"
                    ref={destinationInputDesktopRef}
                    className="bg-[#eee] pl-10 pr-4 py-3 text-base rounded-lg w-full outline-none"
                    type="text"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setPanelOpen(true);
                      setActiveField("destination");
                    }}
                    onClick={() => {
                      setPanelOpen(true);
                      setActiveField("destination");
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-lg mt-4 w-full font-semibold cursor-pointer"
                >
                  Find a ride
                </button>
              </form>

              {panelOpen && (
                <div className="mt-4 border-t border-gray-100 pt-2">
                  <LocationSearchPanel
                    setPanelOpen={setPanelOpen}
                    setVehiclePanel={setVehiclePanel}
                    suggestions={activeSuggestions}
                    isLoading={isActiveSuggestionsLoading}
                    mapError={mapError}
                    currentQuery={activeField === "pickup" ? pickupLocation : destination}
                    onSuggestionSelect={handleSuggestionSelect}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAP AREA (Full width on mobile, right side on desktop)
          ========================================================================= */}
      <div className="flex-1 h-full w-full relative z-0">
        {/* Mobile Header Logo */}
        <img
          className="md:hidden w-18 absolute left-6 top-6 z-10"
          src={logo}
          alt="RideX Logo"
        />

        <LiveTracking />
      </div>

      {/* =========================================================================
          MOBILE-ONLY SLIDING DRAWER & PANELS (< md)
          ========================================================================= */}
      <div className="md:hidden flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none z-10">
        <div className="h-[30%] p-6 bg-white relative pointer-events-auto">
          <h5
            ref={PanelCloseRef}
            className="absolute top-6 right-6 text-2xl font-semibold opacity-0 cursor-pointer"
            onClick={() => {
              setPanelOpen(false);
            }}
          >
            <i className="ri-arrow-down-wide-fill"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={handleFindRide}>
            <div className="line absolute bg-gray-900 w-1 h-16 top-[42%] left-12 rounded-full"></div>
            <input
              id="pickupLocation"
              name="pickupLocation"
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5 outline-none"
              type="text"
              placeholder="Add a pick-up location"
              value={pickupLocation}
              onChange={(e) => {
                setPickupLocation(e.target.value);
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
            />
            <input
              id="destination"
              name="destination"
              ref={destinationInputRef}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3 outline-none"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setPanelOpen(true);
                setActiveField("destination");
              }}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
            />
          </form>
          {panelOpen && (
            <button
              type="button"
              onClick={handleFindRide}
              className="bg-black text-white px-6 py-3 rounded-lg mt-4 w-full cursor-pointer"
            >
              Find a ride
            </button>
          )}
        </div>

        <div
          ref={panelRef}
          className="bg-white h-0 pointer-events-auto overflow-y-auto"
        >
          {panelOpen && (
            <LocationSearchPanel
              setPanelOpen={setPanelOpen}
              setVehiclePanel={setVehiclePanel}
              suggestions={activeSuggestions}
              isLoading={isActiveSuggestionsLoading}
              mapError={mapError}
              currentQuery={activeField === "pickup" ? pickupLocation : destination}
              onSuggestionSelect={handleSuggestionSelect}
            />
          )}
        </div>
      </div>

      {/* Mobile Sliding Vehicle Panel */}
      <div
        ref={vehiclePanelRef}
        className="md:hidden fixed w-full z-20 bottom-0 px-3 py-10 translate-y-full bg-white pt-12"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setPanelOpen={setPanelOpen}
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      {/* Mobile Sliding Confirm Ride Panel */}
      <div
        ref={confirmRidePanelRef}
        className="md:hidden fixed w-full z-20 bottom-0 px-3 py-6 translate-y-full bg-white pt-12"
      >
        <ConfirmRide
          vehicleType={vehicleType}
          fare={fare}
          pickupLocation={pickupLocation}
          destination={destination}
          createRide={createRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      {/* Mobile Sliding Looking For Driver Panel */}
      <div
        ref={vehicleFoundRef}
        className="md:hidden fixed w-full z-20 bottom-0 px-3 py-6 translate-y-full bg-white pt-12"
      >
        <LookingForDriver
          vehicleType={vehicleType}
          fare={fare}
          pickupLocation={pickupLocation}
          destination={destination}
          setVehicleFound={setVehicleFound}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      {/* Mobile Sliding Waiting For Driver Panel */}
      <div
        ref={waitingForDriverRef}
        className="md:hidden fixed w-full z-20 bottom-0 px-3 py-6 translate-y-full bg-white pt-12"
      >
        <WaitingForDriver
          ride={ride}
          vehicleType={vehicleType}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
