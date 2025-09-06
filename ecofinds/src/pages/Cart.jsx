import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast"; // ✅ Import toast

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/cart");
      setItems(data.cart?.items || []);
    } catch (err) {
      toast.error("Failed to fetch cart"); // ✅ Toast error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove item
  const remove = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      toast.success("Item removed from cart"); // ✅ Toast success
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item");
      console.error(err);
    }
  };

  // Checkout
  const checkout = async () => {
    try {
      await api.post("/orders");
      toast.success("Order placed successfully! 🎉"); // ✅ Toast success
      fetchCart();
    } catch (err) {
      toast.error("Checkout failed"); // ✅ Toast error
      console.error(err);
    }
  };

  const total = items.reduce((sum, it) => sum + (it.product?.price || 0), 0);

  // Loader component
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

  const EmptyCart = () => (
    <div className="flex flex-col justify-center items-center py-20 text-gray-400 animate-fadeIn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 mb-4 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M7 13h10M5 6h14"
        />
      </svg>
      <div className="text-xl font-semibold">Your cart is empty</div>
      <div className="text-sm mt-1">Add products to get started</div>
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
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="space-y-4">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={i.product?.image_url || "https://via.placeholder.com/100"}
                    alt={i.product?.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{i.product?.title}</div>
                    <div className="text-orange-400 font-medium mt-1">₹{i.product?.price}</div>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-4">
              <div className="text-xl font-semibold">Total: ₹{total}</div>
              <button
                onClick={checkout}
                className="mt-2 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 shadow-lg"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
