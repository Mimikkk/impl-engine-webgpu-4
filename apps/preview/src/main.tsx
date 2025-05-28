import { x } from "@nimir/lib-engine";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const App = () => {
  return (
    <div className="">
      123 ab 12233123123123 12233
      <div>{x} 11s</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
