const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-6 py-20 text-center">
    <div className="max-w-xl rounded-[32px] border border-white/10 bg-slate-900/70 p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 text-slate-300">
        The route you requested does not exist. Return to the dashboard to
        continue exploring LearnMind.
      </p>
    </div>
  </div>
);

export default NotFoundPage;
