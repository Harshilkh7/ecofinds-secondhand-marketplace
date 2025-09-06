import React, { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/my-products");
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  // Fancy loader
  const Loader = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-16 h-16 animate-spin-slow">
        <div className="absolute w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full"></div>
        <div className="absolute w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full top-2 left-2 animate-spin-reverse"></div>
        <div className="absolute w-8 h-8 border-4 border-t-transparent border-blue-300 rounded-full top-4 left-4 animate-spin-slow"></div>
      </div>
      <style jsx>{`
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 1.5s linear infinite; }
      `}</style>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col justify-center items-center py-20 text-gray-400 animate-fadeIn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 mb-4 text-gray-500 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
      </svg>
      <div className="text-xl font-semibold">No products found</div>
      <div className="text-sm mt-1">Add a new product to get started</div>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce { animation: bounce 1s infinite; }
      `}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My Listings</h2>
          <a
            href="/add-product"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow transition duration-200"
          >
            Add Product
          </a>
        </div>

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="border border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <ProductCard product={p} />
                <div className="p-3 flex gap-3 justify-between">
                  <a
                    href={`/product/${p.id}`}
                    className="px-3 py-1 border rounded-md hover:bg-gray-800 transition-colors duration-200"
                  >
                    View
                  </a>
                  <button
                    onClick={() => del(p.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
