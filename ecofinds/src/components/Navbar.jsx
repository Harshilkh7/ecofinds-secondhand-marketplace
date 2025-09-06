import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          className="text-2xl font-bold text-gray-900 dark:text-white"
          onClick={() => navigate("/")}
        >
          EcoFinds
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Marketplace
          </Link>
          <Link
            to="/my-listings"
            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            My Listings
          </Link>
        </div>

        {/* Search + Cart + Auth */}
        <div className="flex items-center gap-3">
          <input
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(`/?search=${encodeURIComponent(e.target.value)}`)
            }
            placeholder="Search..."
            className="hidden sm:inline-block border rounded px-3 py-1 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
          <Link
            to="/cart"
            className="relative px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FiShoppingCart className="w-5 h-5" />
          </Link>

          {user ? (
            <>
              <span className="hidden sm:inline-block text-gray-900 dark:text-white">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Marketplace
          </Link>
          <Link
            to="/my-listings"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            My Listings
          </Link>
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
