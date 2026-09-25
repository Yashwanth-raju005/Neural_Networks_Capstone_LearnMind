import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, updateProgress } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

const initialProfile = { full_name: "", college: "", phone: "", course: "", branch: "", graduation_year: "" };
const initialProgress = { completed_courses: 0, current_streak: 0, weekly_hours: 0, overall_progress: 0 };

const ProfilePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [progress, setProgress] = useState(initialProgress);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  useEffect(() => {
    getProfile().then((response) => {
      setEmail(response.data.user?.email || "");
      setProfile({ ...initialProfile, ...(response.data.profile || {}) });
      setProgress({ ...initialProgress, ...(response.data.progress || {}) });
    }).catch(() => pushToast("Unable to load profile", "error")).finally(() => setLoading(false));
  }, [pushToast]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      await updateProfile({ ...profile, email });
      pushToast("Profile details saved", "info");
    } catch {
      pushToast("Unable to save profile", "error");
    }
  };

  const handleProgressSave = async () => {
    try {
      await updateProgress(progress);
      pushToast("Progress updated", "info");
    } catch {
      pushToast("Unable to update progress", "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fields = [
    ["full_name", "Full name"], ["college", "College / University"], ["phone", "Phone number"],
    ["course", "Course"], ["branch", "Branch / specialization"], ["graduation_year", "Graduation year"],
  ];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8"><p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Profile</p><h1 className="mt-2 text-3xl font-semibold text-white">{user?.role === "admin" ? "Admin profile" : "Your learner profile"}</h1><p className="mt-3 text-slate-300">Keep the details used across your LearnMind experience up to date.</p></div>
      {loading ? <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 text-slate-400">Loading profile...</div> : <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleProfileSave} className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">Personal and academic details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="text-sm text-slate-400">{label}<input type={key === "graduation_year" ? "number" : "text"} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-cyan-300" value={profile[key] || ""} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} /></label>)}<label className="text-sm text-slate-400 sm:col-span-2">Email<input type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-cyan-300" value={email} onChange={(event) => setEmail(event.target.value)} /></label></div>
          <button className="mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 font-semibold text-white">Save profile</button>
        </motion.form>
        <div className="space-y-6"><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold text-white">Learning snapshot</h2><div className="mt-4 space-y-3 text-sm text-slate-300"><div className="rounded-2xl bg-white/5 p-4">Interest: {profile.interest || "Not set"}</div><div className="rounded-2xl bg-white/5 p-4">Career goal: {profile.career_goal || "Not set"}</div><div className="rounded-2xl bg-white/5 p-4">Learning style: {profile.learning_style || "Not set"}</div></div></motion.div>
          {user?.role === "student" && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold text-white">Progress controls</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(progress).map(([key, value]) => <label key={key} className="text-xs capitalize text-slate-400">{key.replaceAll("_", " ")}<input type="number" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white" value={value ?? 0} onChange={(event) => setProgress({ ...progress, [key]: Number(event.target.value) })} /></label>)}</div><button onClick={handleProgressSave} className="mt-5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-100">Save progress</button></motion.div>}
          <button onClick={handleLogout} className="w-full rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200">Logout</button>
        </div>
      </div>}
    </div>
  );
};

export default ProfilePage;