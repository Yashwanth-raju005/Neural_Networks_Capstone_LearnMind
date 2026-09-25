import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCpu,
  FiLayers,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

const features = [
  {
    title: "Neural Path Planning",
    text: "Train a real MLP model to create adaptive learning sequences.",
    icon: FiCpu,
  },
  {
    title: "Adaptive Difficulty",
    text: "Predict study hours, difficulty, and speed from learner behavior.",
    icon: FiLayers,
  },
  {
    title: "Safe & Secure",
    text: "Protected accounts, role-based access, and modern authentication.",
    icon: FiShield,
  },
  {
    title: "Actionable Insights",
    text: "Track your progress with analytics and AI recommendations.",
    icon: FiTrendingUp,
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-6 py-20 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.20),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
              AI-powered personalized learning platform
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              LearnMind generates smart learning paths with neural networks.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Create adaptive roadmaps, forecast study time, and surface the
              right content for every learner using a production-grade ML
              workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 font-semibold text-white"
              >
                Start for free
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/10 px-6 py-3 font-semibold text-slate-100"
              >
                Explore demo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <span>10,000+ synthetic student profiles</span>
              <span>TensorFlow MLP model</span>
              <span>JWT-protected experience</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <div className="glass-card rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-cyan-500/10">
              <div className="rounded-[24px] border border-cyan-400/20 bg-slate-950/70 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-300">
                      Neural Recommendation Engine
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      94.2% prediction accuracy
                    </p>
                  </div>
                  <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-3 text-violet-200">
                    <FiCpu size={24} />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Skill Gap Analysis",
                    "Personalized Roadmap",
                    "Study Time Forecast",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Everything needed for a premium AI learning experience
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-200 shadow-lg shadow-slate-950/20"
              >
                <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-cyan-200 w-fit">
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">{feature.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                From profile to personalized roadmap in minutes
              </h2>
            </div>
            <div className="grid gap-4">
              {[
                "Share your interests, skills, style, and goals",
                "The neural network predicts difficulty, study time, and confidence",
                "Get a complete weekly plan, resources, and progress analytics",
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[32px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-8 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Ready to see the future of learning?
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Build your AI-guided learning journey today.
            </h2>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-900"
          >
            Get started <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
