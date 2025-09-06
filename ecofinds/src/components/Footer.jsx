import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">EcoFinds</h2>
          <p className="text-gray-400">
            Delivering quality products with a seamless shopping experience. Customer satisfaction is our top priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
            </li>
            <li>
              <a href="/my-listings" className="hover:text-blue-400 transition-colors">My Listings</a>
            </li>
            <li>
              <a href="/cart" className="hover:text-blue-400 transition-colors">Cart</a>
            </li>
            <li>
              <a href="/add-product" className="hover:text-blue-400 transition-colors">Add Product</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="/faq" className="hover:text-blue-400 transition-colors">FAQ</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-white rounded-full transition-all duration-300 shadow-md"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} YourSite. All rights reserved.
      </div>
    </footer>
  );
}
