import React, { useEffect, useState } from "react";
import {
  useNavigate,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Dashboard from "./HomeComponents/Dashboard";
import Settings from "./HomeComponents/Setting";
import ExpenseIncomeVisualization from "./HomeComponents/ExpenseIncomeVisualization";
import AuthForm from "./AuthComponent/AuthComponent";

// HomePage component with routing
const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathName, setPathname] = useState();

  useEffect(() => {
    setPathname(window.location.pathname);
  }, [window.location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    // <BrowserRouter>
    <div className="w-full max-w-[250px] flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="md:hidden bg-blue-500 p-4 flex items-center justify-between">
        <h1 className="font-bold text-white text-xl">EXPENSE TRACKER</h1>
        <button className="text-white p-2" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar - desktop and mobile */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } md:block md:w-64 bg-blue-800 md:min-h-screen fixed top-0 left-0 z-10 h-full md:h-auto`}
      >
        {/* Logo section - visible only on desktop */}
        <div className="hidden md:block p-4">
          <h1 className="font-bold text-white text-xl">EXPENSE TRACKER</h1>
        </div>

        {/* Navigation menu */}
        <nav className="mt-6 px-3 ">
          <ul>
            <li>
              <Link
                to="/"
                className={`block px-4 py-3 text-white hover:bg-blue-600 transition-all ease-in-out duration-200 rounded-md my-2 ${
                  pathName == "/" && "bg-blue-600"
                } `}
                onClick={() => {
                  setMenuOpen(false);
                  setPathname("/");
                }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/analysis"
                className={`block px-4 py-3 text-white hover:bg-blue-600 transition-all ease-in-out duration-200 rounded-md my-2 ${
                  pathName == "/analysis" && "bg-blue-600"
                } `}
                onClick={() => {
                  setMenuOpen(false);
                  setPathname("/analysis");
                }}
              >
                Analysis
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className={`block px-4 py-3 text-white hover:bg-blue-600 transition-all ease-in-out duration-200 rounded-md my-2 ${
                  pathName == "/settings" && "bg-blue-600"
                } `}
                onClick={() => {
                  setMenuOpen(false);
                  setPathname("/settings");
                }}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
