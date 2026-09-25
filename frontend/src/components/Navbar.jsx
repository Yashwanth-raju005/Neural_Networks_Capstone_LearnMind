import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FiCpu, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-semibold text-white"
        >
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-2">
            <FiCpu className="text-cyan-300" />
          </div>
          LearnMind
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link
            to="/about"
            className={
              location.pathname === "/about"
                ? "text-cyan-300"
                : "hover:text-white"
            }
          >
            About
          </Link>
          <Link
            to="/contact"
            className={
              location.pathname === "/contact"
                ? "text-cyan-300"
                : "hover:text-white"
            }
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className={
                  (user.role === "admin"
                    ? location.pathname === "/admin"
                    : location.pathname === "/dashboard")
                    ? "text-cyan-300"
                    : "hover:text-white"
                }
              >
                Workspace
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 hover:bg-white/10"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-200"
              >
                <FiLogIn /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 font-medium text-white"
              >
                <FiUser /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
