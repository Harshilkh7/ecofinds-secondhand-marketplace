import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast"; // ✅ Import toast

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        username: form.name,
        email: form.email,
        password: form.password,
      };

      const { data } = await api.post("/auth/signup", payload);
      login(data.token);
      toast.success("Account created successfully! 🎉"); // ✅ Toast success
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg); // ✅ Toast error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-800 via-blue-900 to-indigo-900 animate-gradient-x -z-10"></div>

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-6 transition-all duration-300 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>

        <div className="space-y-5">
          {["name", "email", "password"].map((field, idx) => (
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
            "Create Account"
          )}
        </button>

        <div className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Sign In
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
      `}</style>
    </div>
  );
}
