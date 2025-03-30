import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import './index.css'

const router = createBrowserRouter([
  {
    path: "/*", // Catch all routes
    element: <App />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Using local storage
if (localStorage.getItem("hasVisited") === null) {
  // First visit
  console.log("First time!");
  localStorage.setItem("hasVisited", "true");
  alert("Hi :), welcome to Wiki Leaderboard");
} else {
  // Not the first visit
  console.log("Not the first time!");
  alert("Welcome back freind :)");
};