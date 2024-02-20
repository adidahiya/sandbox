import React from "react";
import ReactDOM from "react-dom/client";
// import ViteDemo from "./components/ViteDemo.tsx";
import Sandbox from "./components/Sandbox.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ViteDemo /> */}
    <Sandbox />
  </React.StrictMode>,
);
