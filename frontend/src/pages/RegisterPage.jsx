import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const { register } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      pushToast(
        "Registration complete. Your AI learning profile is ready.",
        "info",
      );
      navigate(form.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      pushToast(error?.response?.data?.error || "Registration failed", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-xl"
      >
        <h2 className="text-3xl font-semibold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Join LearnMind and unlock AI-guided learning.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            aria-label="Account role"
            className="w-full rounded-2xl border border-cyan-400/30 bg-slate-800 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 [&>option]:bg-slate-800 [&>option]:text-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-300">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
