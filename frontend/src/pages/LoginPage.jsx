import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form);
      pushToast("Login successful. Welcome back.", "info");
      navigate(response.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      pushToast(error?.response?.data?.error || "Unable to sign in", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
      >
        <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to continue your adaptive learning journey.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account?{" "}
          <Link to="/register" className="text-cyan-300">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
