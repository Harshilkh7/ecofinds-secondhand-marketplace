import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        setAdding(true);
        try {
            await api.post("/cart", { productId: id });
            alert("Added to cart");
        } catch (err) {
            alert("Add to cart failed. Login required.");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-semibold">Product not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden md:flex md:gap-6">
                {/* Image */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 flex items-center justify-center">
                    <img
                        src={product.image_url || "https://via.placeholder.com/600x400"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>

                {/* Details */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.title}</h1>
                        <p className="text-xl text-orange-500 font-semibold mb-4">₹{product.price}</p>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>
                    </div>

                    <button
                        onClick={addToCart}
                        disabled={adding}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
                    >
                        {adding ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <FiShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
