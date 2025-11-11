import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { FaRegCircleUser } from "react-icons/fa6";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-dark-100 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <Logo size="md" />
              </Link>
            </div>
            {/* Navigation */}
            <nav className="hidden md:flex md:space-x-8 text-sm">
              <Link
                to="/about"
                className="text-dark-600 hover:text-dark-900 font-medium transition-colors"
              >
                Company
              </Link>
              <Link
                to="/services"
                className="text-dark-600 hover:text-dark-900 font-medium transition-colors"
              >
                Energy
              </Link>
              <Link
                to="/contact"
                className="text-dark-600 hover:text-dark-900 font-medium transition-colors"
              >
                Charging
              </Link>
              <Link
                to="/contact"
                className="text-dark-600 hover:text-dark-900 font-medium transition-colors"
              >
                Commercial
              </Link>
              <Link
                to="/contact"
                className="text-dark-600 hover:text-dark-900 font-medium transition-colors"
              >
                Residential
              </Link>
            </nav>
            {/* Auth Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="btn-ghost">
                Dealers
              </Link>
              <Link to="/register" className="btn-primary">
                Get a quote
              </Link>
              <Link to="/register" className="btn-ghost">
                <FaRegCircleUser size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
