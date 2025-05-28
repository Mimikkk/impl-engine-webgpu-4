import { x } from "@nimir/lib-engine";
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return <div>Hello W12312312orld {x}</div>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
