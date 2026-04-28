import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import CaptainContext from "./context/CaptainContext.jsx";
import UserContext from "./context/UserContext.jsx";
import SocketContext from "./context/SocketContext.jsx";
import 'remixicon/fonts/remixicon.css';


createRoot(document.getElementById("root")).render(
  <SocketContext>
    <CaptainContext>
      <UserContext>
        <BrowserRouter>
        <App />
      </BrowserRouter>
      </UserContext>
    </CaptainContext>
  </SocketContext>
);
