import { Link,useLocation,useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";


const Riding = () => {
  const location = useLocation();
  const {socket} = useContext(SocketContext);
  const {ride} =location.state || {}; 
  const navigate = useNavigate();

  socket.on("ride-ended",(ride)=>{
    navigate("/home");
  });

  return (
<div className="h-screen">
  <Link to="/home" className="fixed h-10 w-10 bg-white flex items-center justify-center rounded-full top-3 left-5 z-30">
    <i className="text-lg font-bold ri-home-5-line"></i>
  </Link>
  <div className="h-1/2 ">
        <LiveTracking/>
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            className="h-24"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8zMDUxZTYwMi0xMGJiLTRlNjUtYjEyMi1lMzk0ZDgwYTljNDcucG5n"
          />

          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">{ride?.captain?.fullname?.firstname}</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1 uppercase">{ride?.captain?.vehicle?.plate}</h4>
            {/* <p className="text-sm text-gray-600">Maruti Suzuti alto</p> */}
          </div>
        </div>
        <div className="flex flex-col  items-center p-2 ">
          <div className="w-full">
            
            <div className="flex items-center space-x-3 mb-3 border-b-2 border-gray-200 p-2">
              <i className="text-lg ri-map-pin-fill"></i>
              <div>
                <h3 className="text-lg font-medium">{ride?.destination}</h3>
                {/* <p className="text-gray-600 text-sm -mt-1">
                  Kankariya Talab, Ahemdabad
                </p> */}
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-3 px-2">
              <i className="text-lg ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare}</h3>

                <p className="text-gray-600 text-sm -mt-1">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full bg-green-600 rounded-lg text-white p-2 font-semibold mt-2">Make a payment</button>
      </div>
    </div>
  );
};

export default Riding;
