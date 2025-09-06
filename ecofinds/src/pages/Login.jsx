import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast"; // ✅ import toast

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, loadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      // Save token
      localStorage.setItem("token", data.token);

      // Load user after token is stored
      if (loadUser) await loadUser();

      // Show success toast
      toast.success("Login successful!");

      // Navigate to home
      navigate("/");
    } catch (err) {
      const res = err.response?.data;

      // Show error toast
      if (res?.errors) {
        toast.error(res.errors[0].msg);
      } else {
        toast.error(res?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-4">
      {/* Form container */}
      <form
        className="w-full max-w-md bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-6 border border-gray-700 transition-all duration-300"
        onSubmit={submit}
      >
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>

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
      </form>
    </div>
  );
}
