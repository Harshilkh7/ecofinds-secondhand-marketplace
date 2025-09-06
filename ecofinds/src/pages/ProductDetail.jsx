import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(0);
  const [updating, setUpdating] = useState(false);

  const Loader = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);

        const cartRes = await api.get("/cart");
        const cartItem = cartRes.data.cart?.items.find(
          (item) => item.product?.id === res.data.product.id
        );
        if (cartItem) setQty(cartItem.qty || 1);
      } catch (err) {
        toast.error("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const updateCart = async (change) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setUpdating(true);
    try {
      if (change === 1) {
        await api.post("/cart", { productId: id });
        setQty(qty + 1);
        toast.success("Added to cart ✅");
      } else if (change === -1 && qty > 1) {
        const cartRes = await api.get("/cart");
        const cartItem = cartRes.data.cart.items.find(
          (item) => item.product.id === product.id
        );
        if (cartItem) {
          await api.delete(`/cart/${cartItem.id}`);
          setQty(qty - 1);
          toast.success("Removed one item from cart");
        }
      } else if (change === -1 && qty === 1) {
        const cartRes = await api.get("/cart");
        const cartItem = cartRes.data.cart.items.find(
          (item) => item.product.id === product.id
        );
        if (cartItem) {
          await api.delete(`/cart/${cartItem.id}`);
          setQty(0);
          toast.success("Removed from cart");
        }
      }
    } catch (err) {
      toast.error("Failed to update cart");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-semibold">Product not found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden md:flex md:gap-6">
        {/* Image Section */}
        <div className="md:w-1/2 h-80 md:h-auto bg-gray-100 flex items-center justify-center relative group">
          <img
            src={product.images[0] || "https://via.placeholder.com/600x400"}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.category && (
            <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
              {product.category}
            </span>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {product.title}
            </h1>
            <p className="text-2xl text-green-600 font-bold mb-4">₹{product.price}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Seller Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {product.seller?.username?.[0] || "S"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {product.seller?.name || "Rahul"}
                </p>
                <p className="text-sm text-gray-500">{product.seller?.email}</p>
              </div>
            </div>
          </div>

          {/* Cart Controls */}
          {qty === 0 ? (
            <button
              onClick={() => updateCart(1)}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
            >
              {updating ? <Loader /> : "🛒 Add to Cart"}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateCart(-1)}
                disabled={updating}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
              >
                -
              </button>
              <span className="text-lg font-semibold">{qty}</span>
              <button
                onClick={() => updateCart(1)}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
