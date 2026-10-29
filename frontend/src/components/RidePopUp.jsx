import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer md:hidden"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      {/* Large Screen Back Arrow + Title */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => {
            props.setRidePopupPanel(false);
          }}
          className="hidden md:flex w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 items-center justify-center transition cursor-pointer"
          title="Back"
        >
          <i className="ri-arrow-left-line text-lg font-semibold"></i>
        </button>
        <h3 className="text-2xl font-semibold">New Ride Available</h3>
      </div>
      <div className="flex items-center justify-between p-2 bg-yellow-300 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://cdn.create.vista.com/api/media/small/64961499/stock-photo-beautiful-young-woman-selfie-in-the-park"
            alt="User"
          />
          <h2 className="text-lg font-medium capitalize">
            {(props.ride?.user?.fullname?.firstname || "User") +
              (props.ride?.user?.fullname?.lastname
                ? " " + props.ride.user.fullname.lastname
                : "")}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">3.2km</h5>
      </div>
      <div className="flex flex-col items-center p-2">
        <div className="w-full">
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-user-fill text-yellow-600"></i>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Pickup</h3>
              <p className="text-gray-800 text-sm font-medium">
                {props.ride?.pickup || "Pickup location"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
            <i className="text-lg ri-map-pin-fill text-green-600"></i>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Destination</h3>
              <p className="text-gray-800 text-sm font-medium">
                {props.ride?.destination || "Destination location"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-3 px-2">
            <i className="text-lg ri-currency-line text-gray-700"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-gray-600 text-sm -mt-1">Cash</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-around mt-3">
          <button
            onClick={() => {
              props.setRidePopupPanel(false);
            }}
            disabled={props.isAccepting}
            className="bg-gray-400 hover:bg-gray-500 rounded-lg text-white py-2 px-10 font-semibold cursor-pointer transition disabled:opacity-50"
          >
            Reject
          </button>
          <button
            disabled={props.isAccepting}
            onClick={() => {
              props.confirmRide();
            }}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white py-2 px-10 font-semibold cursor-pointer transition flex items-center justify-center"
          >
            {props.isAccepting ? "Accepting..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
