import React, { useState } from "react";
import { Link } from "react-router-dom";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg hover:bg-gray-50 transition-all"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-4 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <img src="/media/mayer-logo.svg" alt="Mayer" className="h-8" />
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1 px-4">
              <Link
                to="/"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/company"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Company
              </Link>
              <Link
                to="/energy"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Energy
              </Link>
              <Link
                to="/charging"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Charging
              </Link>
              <Link
                to="/commercial"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Commercial
              </Link>
              <Link
                to="/residential"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Residential
              </Link>
              <Link
                to="/dealers"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dealers
              </Link>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 px-4 space-y-1">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-center font-medium"
              >
                Get a quote
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
