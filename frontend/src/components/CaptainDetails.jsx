import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-start gap-2">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://m.media-amazon.com/images/M/MV5BNzI5MWI0NGMtMmMyMC00MWUzLWE4ZjktNTA3MTMyZDMxNDExXkEyXkFqcGc@._V1_.jpg"
            alt="Captain Avatar"
          />
          <h5 className="text-lg font-medium capitalize">
            {(captain?.fullname?.firstname || "") + " " + (captain?.fullname?.lastname || "")}
          </h5>
        </div>
        <div>
          <h4 className="text-lg font-semibold">₹{captain?.earnings ?? 0}</h4>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex mt-7 bg-gray-100 p-4 rounded-xl items-start justify-center gap-4">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">
            {typeof captain?.hoursOnline === "number" ? captain.hoursOnline.toFixed(1) : "0.0"}
          </h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">
            {typeof captain?.totalDistance === "number" ? captain.totalDistance.toFixed(1) : "0.0"}
          </h5>
          <p className="text-sm text-gray-600">KM Driven</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">
            {captain?.totalRides ?? 0}
          </h5>
          <p className="text-sm text-gray-600">Total Rides</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
