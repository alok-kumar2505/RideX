import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";

const Home = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState("pickup");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isPickupLoading, setIsPickupLoading] = useState(false);
  const [isDestinationLoading, setIsDestinationLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const destinationInputRef = useRef(null);
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
        },
      );

      // console.log("Fare response:", response.data);
      setFare(response.data?.fare || {});
      return true;
    } catch (error) {
      console.error(
        "Error fetching fare:",
        error?.response?.data || error.message,
      );
      return false;
    }
  };

  const handleFindRide = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!pickupLocation.trim()) {
      setActiveField("pickup");
      setPanelOpen(true);
      return;
    }

    if (!destination.trim()) {
      setActiveField("destination");
      setPanelOpen(true);
      setTimeout(() => {
        destinationInputRef.current?.focus();
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
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: currentQuery },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

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
        destinationInputRef.current?.focus();
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
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
      });
      gsap.to(PanelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: "0px",
      });
      gsap.to(PanelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
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
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating ride:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  }

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
          <h5
            ref={PanelCloseRef}
            className="absolute top-6 right-6 text-2xl font-semibold"
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
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
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
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
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
              className="bg-black text-white px-6 py-3 rounded-lg mt-4 w-full"
            >
              Find a ride
            </button>
          )}
        </div>

        <div ref={panelRef} className="bg-white h-0">
          {panelOpen && (
            <LocationSearchPanel
              setPanelOpen={setPanelOpen}
              setVehiclePanel={setVehiclePanel}
              suggestions={activeSuggestions}
              isLoading={isActiveSuggestionsLoading}
              onSuggestionSelect={handleSuggestionSelect}
            />
          )}
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className=" fixed w-full
         z-20 bottom-0 px-3 py-10 translate-y-full bg-white pt-12"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setPanelOpen={setPanelOpen}
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className=" fixed w-full z-20 bottom-0 px-3 py-6 translate-y-full bg-white pt-12"
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

      <div
        ref={vehicleFoundRef}
        className=" fixed w-full z-20 bottom-0 px-3 py-6 translate-y-full bg-white pt-12"
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

      <div
        ref={waitingForDriverRef}
        className=" fixed w-full z-20 bottom-0 px-3 py-6  bg-white pt-12"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
