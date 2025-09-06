import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
    const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFile = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("title", form.title);
            fd.append("description", form.description);
            fd.append("price", form.price);
            fd.append("category", form.category);
            if (image) fd.append("image", image);

            await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
            navigate("/my-listings");
        } catch (err) {
            console.error(err);
            setError("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-4">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-blue-900 to-indigo-900 animate-gradient-x -z-10"></div>

            <form
                onSubmit={submit}
                className="w-full max-w-xl bg-gray-800/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl space-y-6 border border-gray-700 transition-all duration-300"
            >
                <h2 className="text-3xl font-bold text-white text-center">Add New Product</h2>

                {error && <div className="text-red-400 text-center font-medium animate-fadeIn">{error}</div>}

                <div className="space-y-4">
                    {["title", "price", "category"].map((field, idx) => (
                        <div key={idx} className="relative">
                            <input
                                type="text"
                                value={form[field]}
                                onChange={handleChange(field)}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                required
                                className="peer w-full rounded-xl px-3 pt-5 pb-2 text-white bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300 shadow-sm"
                            />
                            <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-400 peer-focus:text-sm">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                        </div>
                    ))}

                    <div className="relative">
                        <textarea
                            value={form.description}
                            onChange={handleChange("description")}
                            placeholder="Description"
                            className="peer w-full rounded-xl px-3 pt-5 pb-2 text-white bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300 shadow-sm h-32 resize-none"
                        />
                        <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-400 peer-focus:text-sm">
                            Description
                        </label>
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-400">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            className="w-full text-white rounded-xl px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-3 w-full h-52 object-cover rounded-xl shadow-inner border border-gray-600"
                            />
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition duration-200 shadow-lg"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Add Product"
                    )}
                </button>
            </form>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }
      `}</style>
        </div>
    );
}
