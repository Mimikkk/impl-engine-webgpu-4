import { x } from "@nimir/lib-engine";
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return <div>123 A12311B {x} 222222</div>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
