import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl overflow-hidden shadow-md dark:shadow-gray-900 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={product.images[0] || product.images[1]}
            alt={product.title}
            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-gray-100">
            {product.title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-blue-600 font-semibold">₹{product.price}</div>
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {product.category || "General"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
