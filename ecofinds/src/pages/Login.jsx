import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-4">
      {/* Animated gradient background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-800 via-blue-900 to-indigo-900 animate-gradient-x -z-10"></div>

      <form className="w-full max-w-md bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-6 border border-gray-700 transition-all duration-300" onSubmit={submit}>
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>

        {error && (
          <div className="text-red-400 text-center font-medium animate-fadeIn">{error}</div>
        )}

        <div className="space-y-5">
          {["email", "password"].map((field, idx) => (
            <div key={idx} className="relative">
              <input
                type={field === "password" ? "password" : "text"}
                value={form[field]}
                onChange={handleChange(field)}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="peer w-full rounded-xl px-3 pt-5 pb-2 text-white bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300 shadow-sm"
              />
              <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-400 peer-focus:text-sm">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition duration-200 shadow-lg"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-center text-gray-400">or continue with</div>

        <div className="flex justify-center gap-4">
          {/* Google Login */}
          <button className="flex-1 flex items-center justify-center py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition duration-200 shadow gap-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white">
              <svg className="w-4 h-4" viewBox="0 0 533.5 544.3">
                <path fill="#4285F4" d="M533.5 278.4c0-18.2-1.5-35.8-4.4-52.9H272v100.2h147.1c-6.3 34.2-25.2 63.2-53.5 82.8v68h86.5c50.7-46.7 79.4-115.6 79.4-198.1z"/>
                <path fill="#34A853" d="M272 544.3c72.9 0 134.1-24.1 178.8-65.3l-86.5-68c-24.1 16.1-55 25.7-92.3 25.7-70.8 0-130.8-47.8-152.3-112.2H32.1v70.4C76.3 479.3 169.2 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M119.7 325.9c-5.5-16.1-8.6-33.3-8.6-50.9s3.1-34.8 8.6-50.9V153.7H32.1C11.4 193.1 0 238.6 0 272s11.4 78.9 32.1 118.3l87.6-64.4z"/>
                <path fill="#EA4335" d="M272 107.9c38.9 0 73.6 13.4 101.1 39.6l75.4-75.4C405.8 24.1 344.6 0 272 0 169.2 0 76.3 65 32.1 153.7l87.6 64.4c21.5-64.4 81.5-112.2 152.3-112.2z"/>
              </svg>
            </span>
            Google
          </button>

          {/* Microsoft Login */}
          <button className="flex-1 flex items-center justify-center py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition duration-200 shadow gap-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white p-0.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M6 6h5v5H6z"/>
                <path fill="#7FBA00" d="M13 6h5v5h-5z"/>
                <path fill="#00A4EF" d="M6 13h5v5H6z"/>
                <path fill="#FFB900" d="M13 13h5v5h-5z"/>
              </svg>
            </span>
            Microsoft
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </div>
      </form>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
