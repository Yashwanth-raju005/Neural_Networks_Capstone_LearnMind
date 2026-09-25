const AboutPage = () => (
  <div className="mx-auto max-w-5xl px-6 py-20 text-slate-300">
    <h1 className="text-4xl font-semibold text-white">About LearnMind</h1>
    <p className="mt-4 text-lg">
      LearnMind is a final-year neural networks project that brings together
      modern UI, secure authentication, and a real TensorFlow-based
      recommendation engine.
    </p>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
        The platform generates personalized learning paths using a multi-layer
        perceptron trained on a dataset of 10,000 learners.
      </div>
      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
        The system predicts the best learning sequence, study hours, difficulty,
        resources, and speed for each learner profile.
      </div>
    </div>
  </div>
);

export default AboutPage;
