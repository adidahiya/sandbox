import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

// import ViteDemo from "./components/ViteDemo.tsx";
// import Sandbox from "./components/Sandbox.tsx";
import Repl from "./components/repl/Repl.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="main">
      {/* <ViteDemo /> */}
      {/* <Sandbox /> */}
      <Repl />
    </div>
  </React.StrictMode>,
);
