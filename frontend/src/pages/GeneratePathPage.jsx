import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { generatePath, getLearningPath, toggleLearningTask } from "../services/api";
import { useToast } from "../components/ToastProvider";

const DOMAIN_OPTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Python",
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "Finance",
  "Business Analytics",
  "Blockchain",
  "Game Development",
  "Robotics",
  "Natural Language Processing",
  "Computer Vision",
  "Database Systems",
  "Statistics",
  "Mobile Development",
  "Data Engineering",
  "Prompt Engineering",
  "Research & Writing",
  "Testing & QA",
];

const CAREER_OPTIONS = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Python Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Business Analyst",
  "Digital Marketer",
  "Research Analyst",
  "Financial Analyst",
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LEARNING_STYLES = ["Hands-on", "Structured", "Project-first", "Visual"];
const RESOURCE_TYPES = ["Documentation", "Video", "Projects", "Both"];

const _RESOURCE_LIBRARY = {
  "Artificial Intelligence": {
    documentation: [
      { label: "Google AI", url: "https://ai.google/" },
      { label: "AI for Everyone", url: "https://www.coursera.org/learn/ai-for-everyone" },
    ],
    video: [
      { label: "DeepLearning.AI", url: "https://www.youtube.com/@DeepLearningAI" },
      { label: "AI for Beginners", url: "https://www.youtube.com/results?search_query=ai+for+beginners" },
    ],
  },
  "Machine Learning": {
    documentation: [
      { label: "Scikit-learn Docs", url: "https://scikit-learn.org/stable/documentation.html" },
      { label: "TensorFlow Guide", url: "https://www.tensorflow.org/learn" },
    ],
    video: [
      { label: "StatQuest", url: "https://www.youtube.com/@statquest" },
      { label: "Machine Learning Playlist", url: "https://www.youtube.com/results?search_query=machine+learning+for+beginners" },
    ],
  },
  Python: {
    documentation: [
      { label: "Python Official Docs", url: "https://docs.python.org/3/" },
      { label: "W3Schools Python", url: "https://www.w3schools.com/python/" },
    ],
    video: [
      { label: "Corey Schafer Python", url: "https://www.youtube.com/@coreyms" },
      { label: "Python Crash Course", url: "https://www.youtube.com/results?search_query=python+crash+course" },
    ],
  },
  "Web Development": {
    documentation: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/" },
      { label: "W3Schools Web Dev", url: "https://www.w3schools.com/" },
    ],
    video: [
      { label: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia" },
      { label: "Web Development Playlist", url: "https://www.youtube.com/results?search_query=web+development+full+course" },
    ],
  },
  "Data Science": {
    documentation: [
      { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
      { label: "Pandas Docs", url: "https://pandas.pydata.org/docs/" },
    ],
    video: [
      { label: "Kaggle YouTube", url: "https://www.youtube.com/@kaggle" },
      { label: "Data Science Basics", url: "https://www.youtube.com/results?search_query=data+science+for+beginners" },
    ],
  },
  "Frontend Development": {
    documentation: [
      { label: "MDN HTML/CSS/JS", url: "https://developer.mozilla.org/en-US/docs/Learn/Front-end_web_developer" },
      { label: "React Docs", url: "https://react.dev/learn" },
    ],
    video: [
      { label: "FreeCodeCamp", url: "https://www.youtube.com/@freecodecamp" },
      { label: "The Net Ninja", url: "https://www.youtube.com/@NetNinja-dev" },
    ],
  },
  "Backend Development": {
    documentation: [
      { label: "Node.js Docs", url: "https://nodejs.org/en/docs" },
      { label: "Flask Docs", url: "https://flask.palletsprojects.com/" },
    ],
    video: [
      { label: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia" },
      { label: "Hussein Nasser", url: "https://www.youtube.com/@hnasr" },
    ],
  },
  "Full Stack Development": {
    documentation: [
      { label: "Full Stack Open", url: "https://fullstackopen.com/" },
      { label: "MDN Full Stack Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks" },
    ],
    video: [
      { label: "JavaScript Mastery", url: "https://www.youtube.com/@javascriptmastery" },
      { label: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia" },
    ],
  },
  "Cybersecurity": {
    documentation: [
      { label: "OWASP", url: "https://owasp.org/" },
      { label: "Cybersecurity for Beginners", url: "https://www.cyberaces.org/" },
    ],
    video: [
      { label: "John Hammond", url: "https://www.youtube.com/@_johnhammond" },
      { label: "NetworkChuck", url: "https://www.youtube.com/@NetworkChuck" },
    ],
  },
  "Cloud Computing": {
    documentation: [
      { label: "AWS Skill Builder", url: "https://explore.skillbuilder.aws/" },
      { label: "Google Cloud Docs", url: "https://cloud.google.com/docs" },
    ],
    video: [
      { label: "AWS Training & Certification", url: "https://www.youtube.com/@AWSTrainingandCertification" },
      { label: "Cloud Academy", url: "https://www.youtube.com/@CloudAcademy" },
    ],
  },
  "DevOps": {
    documentation: [
      { label: "Docker Docs", url: "https://docs.docker.com/" },
      { label: "GitHub Docs", url: "https://docs.github.com/" },
    ],
    video: [
      { label: "TechWorld with Nana", url: "https://www.youtube.com/@TechWorldwithNana" },
      { label: "DevOps Toolkit", url: "https://www.youtube.com/@devopstoolkit" },
    ],
  },
  "UI/UX Design": {
    documentation: [
      { label: "NN/g UX", url: "https://www.nngroup.com/" },
      { label: "Figma Learn", url: "https://help.figma.com/hc/en-us" },
    ],
    video: [
      { label: "Flux Academy", url: "https://www.youtube.com/@FluxAcademy" },
      { label: "DesignCourse", url: "https://www.youtube.com/@DesignCourse" },
    ],
  },
  "Product Management": {
    documentation: [
      { label: "Atlassian Agile Guides", url: "https://www.atlassian.com/agile" },
      { label: "ProductPlan", url: "https://www.productplan.com/" },
    ],
    video: [
      { label: "Product School", url: "https://www.youtube.com/@ProductSchool" },
      { label: "Mind the Product", url: "https://www.youtube.com/@MindtheProduct" },
    ],
  },
  "Digital Marketing": {
    documentation: [
      { label: "HubSpot Academy", url: "https://academy.hubspot.com/" },
      { label: "Google Digital Garage", url: "https://skillshop.exceedlms.com/student/catalog/list?category_ids=28" },
    ],
    video: [
      { label: "Ahrefs", url: "https://www.youtube.com/@Ahrefs" },
      { label: "Google Analytics", url: "https://www.youtube.com/@GoogleAnalytics" },
    ],
  },
  Finance: {
    documentation: [
      { label: "Investopedia Academy", url: "https://www.investopedia.com/" },
      { label: "Corporate Finance Institute", url: "https://corporatefinanceinstitute.com/" },
    ],
    video: [
      { label: "Wall Street Prep", url: "https://www.youtube.com/@WallStreetPrep" },
      { label: "The Financial Diet", url: "https://www.youtube.com/@thefinancialdiet" },
    ],
  },
  "Business Analytics": {
    documentation: [
      { label: "Tableau Learning", url: "https://www.tableau.com/learn" },
      { label: "SQLBolt", url: "https://sqlbolt.com/" },
    ],
    video: [
      { label: "Alex The Analyst", url: "https://www.youtube.com/@alextheanalyst" },
      { label: "Data with Baraa", url: "https://www.youtube.com/@datawithbaraa" },
    ],
  },
  Blockchain: {
    documentation: [
      { label: "Ethereum Docs", url: "https://ethereum.org/en/developers/docs/" },
      { label: "Solidity Docs", url: "https://docs.soliditylang.org/en/latest/" },
    ],
    video: [
      { label: "Patrick Collins", url: "https://www.youtube.com/@PatrickAlphaC" },
      { label: "Dapp University", url: "https://www.youtube.com/@DappUniversity" },
    ],
  },
  "Game Development": {
    documentation: [
      { label: "Unity Learn", url: "https://learn.unity.com/" },
      { label: "Godot Docs", url: "https://docs.godotengine.org/en/stable/" },
    ],
    video: [
      { label: "Brackeys", url: "https://www.youtube.com/@Brackeys" },
      { label: "GameDev.tv", url: "https://www.youtube.com/@GameDevTv" },
    ],
  },
  Robotics: {
    documentation: [
      { label: "ROS Docs", url: "https://wiki.ros.org/" },
      { label: "Robot Ignite", url: "https://www.theconstruct.ai/" },
    ],
    video: [
      { label: "The Construct", url: "https://www.youtube.com/@TheConstructAI" },
      { label: "Robotics Basics", url: "https://www.youtube.com/results?search_query=robotics+for+beginners" },
    ],
  },
  "Natural Language Processing": {
    documentation: [
      { label: "Hugging Face Docs", url: "https://huggingface.co/docs" },
      { label: "NLP Guide", url: "https://www.nltk.org/book/" },
    ],
    video: [
      { label: "Hugging Face", url: "https://www.youtube.com/@huggingface" },
      { label: "NLP Demystified", url: "https://www.youtube.com/results?search_query=nlp+for+beginners" },
    ],
  },
  "Computer Vision": {
    documentation: [
      { label: "OpenCV Docs", url: "https://docs.opencv.org/" },
      { label: "PyImageSearch", url: "https://pyimagesearch.com/" },
    ],
    video: [
      { label: "OpenCV", url: "https://www.youtube.com/@OpenCV" },
      { label: "Computer Vision Playlist", url: "https://www.youtube.com/results?search_query=computer+vision+for+beginners" },
    ],
  },
  "Database Systems": {
    documentation: [
      { label: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/" },
      { label: "MySQL Docs", url: "https://dev.mysql.com/doc/" },
    ],
    video: [
      { label: "Data School", url: "https://www.youtube.com/@dataschool" },
      { label: "Database Tutorials", url: "https://www.youtube.com/results?search_query=database+systems+for+beginners" },
    ],
  },
  Statistics: {
    documentation: [
      { label: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" },
      { label: "Stat Trek", url: "https://stattrek.com/" },
    ],
    video: [
      { label: "StatQuest", url: "https://www.youtube.com/@statquest" },
      { label: "Khan Academy", url: "https://www.youtube.com/@khanacademy" },
    ],
  },
  "Mobile Development": {
    documentation: [
      { label: "Flutter Docs", url: "https://docs.flutter.dev/" },
      { label: "Android Docs", url: "https://developer.android.com/docs" },
    ],
    video: [
      { label: "Flutter Teacher", url: "https://www.youtube.com/@FlutterTeacher" },
      { label: "Android Developers", url: "https://www.youtube.com/@AndroidDevelopers" },
    ],
  },
  "Data Engineering": {
    documentation: [
      { label: "Airflow Docs", url: "https://airflow.apache.org/docs/" },
      { label: "Spark Docs", url: "https://spark.apache.org/docs/latest/" },
    ],
    video: [
      { label: "Data Engineering Playlist", url: "https://www.youtube.com/results?search_query=data+engineering+for+beginners" },
      { label: "ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
    ],
  },
  "Prompt Engineering": {
    documentation: [
      { label: "OpenAI Prompt Guide", url: "https://platform.openai.com/docs/guides/prompt-engineering" },
      { label: "Anthropic Prompt Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
    ],
    video: [
      { label: "Prompt Engineering Playbook", url: "https://www.youtube.com/results?search_query=prompt+engineering+tutorial" },
      { label: "AI Explained", url: "https://www.youtube.com/@AIEdited" },
    ],
  },
  "Research & Writing": {
    documentation: [
      { label: "Google Scholar", url: "https://scholar.google.com/" },
      { label: "Purdue OWL", url: "https://owl.purdue.edu/" },
    ],
    video: [
      { label: "Research Methods", url: "https://www.youtube.com/results?search_query=research+methods+tutorial" },
      { label: "Writing Better Essays", url: "https://www.youtube.com/results?search_query=essay+writing+tutorial" },
    ],
  },
  "Testing & QA": {
    documentation: [
      { label: "Selenium Docs", url: "https://www.selenium.dev/documentation/" },
      { label: "Playwright Docs", url: "https://playwright.dev/docs/intro" },
    ],
    video: [
      { label: "Automation Step by Step", url: "https://www.youtube.com/@AutomationStepbyStep" },
      { label: "QA Madness", url: "https://www.youtube.com/@QAMadness" },
    ],
  },
};

const initialState = {
  interest: "Artificial Intelligence",
  current_skill: "Beginner",
  career_goal: "AI Engineer",
  learning_style: "Hands-on",
  available_hours: 12,
  previous_score: 78,
  completed_subjects: 4,
  current_knowledge: 3,
  learning_goal: "Build a job-ready portfolio in 12 weeks",
  target_timeline: "12 weeks",
  practice_mode: "Projects + quizzes",
  resource_focus: "Both",
};

const taskResources = (task) => [
  ["Watch topic video", task.video_url || task.resources?.video],
  ["Read documentation", task.documentation_url || task.resources?.documentation],
  ["Practice this topic", task.practice_url || task.resources?.practice],
  ["Additional resource", task.additional_url || task.resources?.additional],
].filter(([, url]) => Boolean(url));

const GeneratePathPage = () => {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);
  const [taskCompletionState, setTaskCompletionState] = useState({});
  const [xpPoints, setXpPoints] = useState(0);
  const [generating, setGenerating] = useState(false);
  const { pushToast } = useToast();

  useEffect(() => {
    getLearningPath()
      .then((response) => {
        const path = response.data.learning_path;
        const tasks = (path.tasks || []).map((task) => ({ ...task, resources: task.resources || {} }));
        setResult({ ...path, task_checklist: tasks });
        setTaskCompletionState(Object.fromEntries(tasks.map((task) => [task.task_id, Boolean(task.completed)])));
        setXpPoints(0);
      })
      .catch(() => {
        // A new student has no saved path yet.
      });
  }, []);

  const resolveLegacyResourceLibrary = (interest, careerGoal) => {
    const baseLibrary = _RESOURCE_LIBRARY[interest] || _RESOURCE_LIBRARY[careerGoal] || _RESOURCE_LIBRARY["Artificial Intelligence"];
    const careerLibrary = _RESOURCE_LIBRARY[careerGoal] || {};
    const resources = [
      ...(baseLibrary.documentation || []).map((item) => ({ ...item, type: "Documentation" })),
      ...(baseLibrary.video || []).map((item) => ({ ...item, type: "Video" })),
      ...(careerLibrary.documentation || []).map((item) => ({ ...item, type: "Documentation" })),
      ...(careerLibrary.video || []).map((item) => ({ ...item, type: "Video" })),
    ];
    const filtered = form.resource_focus === "Documentation"
      ? resources.filter((item) => item.type === "Documentation")
      : form.resource_focus === "Video"
        ? resources.filter((item) => item.type === "Video")
        : resources;
    return filtered.filter((item, index, items) => items.findIndex((candidate) => candidate.url === item.url) === index);
  };

  const topicResourceCards = (result?.task_checklist || []).flatMap((task) => taskResources(task).map(([label, url]) => ({ label, url })));
  const uniqueResources = (items) => items.filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index);
  const resourceCards = uniqueResources(topicResourceCards.length ? topicResourceCards : resolveLegacyResourceLibrary(form.interest, form.career_goal)).slice(0, 4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (generating) return;
    setGenerating(true);
    try {
      const response = await generatePath(form);
      setResult(response.data.prediction);
      setTaskCompletionState({});
      setXpPoints(0);
      pushToast("Learning path generated successfully", "info");
    } catch (error) {
      pushToast(
        error?.response?.data?.error || "Unable to generate path",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleTaskToggle = async (task, completed) => {
    try {
      const response = await toggleLearningTask(task.task_id, completed);
      setTaskCompletionState((current) => ({
        ...current,
        [task.task_id]: completed,
      }));
      setXpPoints(response.data.xp_points || 0);
      pushToast(
        `${completed ? "Completed" : "Reopened"} ${task.title} — ${response.data.xp_points} XP total`,
        "info",
      );
    } catch {
      pushToast("Unable to update checklist progress", "error");
    }
  };

  const handleDownloadPdf = () => {
    if (!result) {
      pushToast("Generate a roadmap first", "error");
      return;
    }

    const doc = new jsPDF();
    doc.setFillColor(46, 16, 101);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("LearnMind Roadmap", 14, 14);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let cursorY = 34;

    const addSection = (title, lines) => {
      if (cursorY > 250) {
        doc.addPage();
        cursorY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(title, 14, cursorY);
      cursorY += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      lines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, 180);
        doc.text(wrapped, 18, cursorY);
        cursorY += wrapped.length * 6 + 2;
      });
      cursorY += 4;
    };

    addSection("Learner Profile", [
      `Interest: ${form.interest}`,
      `Current Skill: ${form.current_skill}`,
      `Career Goal: ${form.career_goal}`,
      `Learning Style: ${form.learning_style}`,
      `Available Hours: ${form.available_hours} per week`,
      `Learning Goal: ${form.learning_goal}`,
      `Timeline: ${form.target_timeline}`,
      `Preferred Resource: ${form.resource_focus}`,
    ]);

    addSection("AI Prediction Snapshot", [
      `Sequence: ${result.sequence}`,
      `Difficulty: ${result.difficulty}`,
      `Resource Priority: ${result.resource}`,
      `Study Pace: ${result.learning_speed}`,
      `Confidence: ${Math.round(result.confidence * 100)}%`,
      `Daily Habit: ${result.daily_hours} hrs/day`,
    ]);

    addSection("Zero-to-Expert Roadmap", result.roadmap);
    addSection("Study Plan", result.study_plan);
    addSection("Daily Tasks", result.daily_tasks);
    addSection("Weekly Tasks", result.weekly_tasks);
    addSection(
      "Task Checklist",
      (result.task_checklist || []).map(
        (task) => `${task.title} • ${task.resource_type}: ${task.resource_url}`,
      ),
    );

    const resourceLines = resourceCards.map((item) => `${item.label}: ${item.url}`);
    addSection("Resources", resourceLines);
    doc.save(`${form.interest || "roadmap"}-learning-path.pdf`);
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Adaptive Learning
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Build a zero-to-expert roadmap
        </h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          Fill the form clearly, and LearnMind will guide you like a patient
          coach from zero to expert with a neat daily plan, milestones, and
          clickable resource links you can save in your PDF.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-1">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6"
        >
          <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <h3 className="text-xl font-semibold text-white">
              Learner Inputs
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Choose your domain and your goals from the dropdowns below, so the roadmap becomes crystal clear.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Learning interest</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
              >
                {DOMAIN_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Current skill level</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.current_skill}
                onChange={(e) =>
                  setForm({ ...form, current_skill: e.target.value })
                }
              >
                {SKILL_LEVELS.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Career goal</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.career_goal}
                onChange={(e) =>
                  setForm({ ...form, career_goal: e.target.value })
                }
              >
                {CAREER_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Preferred learning style</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.learning_style}
                onChange={(e) =>
                  setForm({ ...form, learning_style: e.target.value })
                }
              >
                {LEARNING_STYLES.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Available hours per week</span>
              <input
                type="number"
                min="1"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.available_hours}
                onChange={(e) =>
                  setForm({ ...form, available_hours: Number(e.target.value) })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Previous test score (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.previous_score}
                onChange={(e) =>
                  setForm({ ...form, previous_score: Number(e.target.value) })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Completed subjects</span>
              <input
                type="number"
                min="0"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.completed_subjects}
                onChange={(e) =>
                  setForm({ ...form, completed_subjects: Number(e.target.value) })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Current knowledge level (1-5)</span>
              <input
                type="number"
                min="1"
                max="5"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.current_knowledge}
                onChange={(e) =>
                  setForm({ ...form, current_knowledge: Number(e.target.value) })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span>What do you want to achieve?</span>
              <textarea
                rows="3"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.learning_goal}
                onChange={(e) =>
                  setForm({ ...form, learning_goal: e.target.value })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Target timeline</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.target_timeline}
                onChange={(e) =>
                  setForm({ ...form, target_timeline: e.target.value })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Practice mode</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.practice_mode}
                onChange={(e) =>
                  setForm({ ...form, practice_mode: e.target.value })
                }
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Preferred resource style</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                value={form.resource_focus}
                onChange={(e) =>
                  setForm({ ...form, resource_focus: e.target.value })
                }
              >
                {RESOURCE_TYPES.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {generating && <FiLoader className="animate-spin" />}
            {generating ? "Creating your personalized learning path..." : "Generate Learning Path"}
          </button>
        </motion.form>

        <div className="min-h-[720px] rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                <div>
                  <p className="text-sm text-cyan-200">AI confidence</p>
                  <p className="text-2xl font-semibold text-white">
                    {Math.round(result.confidence * 100)}%
                  </p>
                  <p className="mt-1 text-sm text-emerald-200">
                    XP earned: {xpPoints}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Download PDF
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Best Sequence</p>
                  <p className="text-lg text-white">{result.sequence}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Difficulty</p>
                  <p className="text-lg text-white">{result.difficulty}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Study Pace</p>
                  <p className="text-lg text-white">{result.learning_speed}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Daily routine</p>
                  <p className="text-lg text-white">{result.daily_hours} hrs/day</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Zero-to-Expert Roadmap
                </h3>
                <ul className="space-y-2 text-slate-300">
                  {result.roadmap.map((step, index) => (
                    <li
                      key={`${step}-${index}`}
                      className="rounded-xl bg-slate-800/70 px-3 py-2"
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Weekly Study Plan
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    {result.study_plan.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="rounded-xl bg-slate-800/70 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Daily Tasks
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    {result.daily_tasks.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="rounded-xl bg-slate-800/70 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Weekly Tasks
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    {result.weekly_tasks.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="rounded-xl bg-slate-800/70 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Resource Stack
                  </h3>
                  <div className="space-y-2 text-slate-300">
                    {resourceCards.map((item, index) => (
                      <a
                        key={`${item.label}-${index}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl bg-slate-800/70 px-3 py-2 text-cyan-200 underline"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    Checkpoint Checklist
                  </h3>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {result.task_checklist?.length || 0} tasks
                  </span>
                </div>
                <div className="space-y-3 text-slate-300">
                  {(result.task_checklist || []).map((task, index) => (
                    <label
                      key={task.task_id}
                      className="block w-full rounded-2xl border border-white/10 bg-slate-800/70 p-4 transition hover:border-cyan-400/40"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                              #{index + 1}
                            </span>
                            <span className="font-medium text-white">
                              {task.title}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-300">
                            {task.description}
                          </p>
                          <div className="mt-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Related links</p>
                            <div className="flex flex-wrap items-center gap-3">
                            {taskResources(task).length ? taskResources(task).map(([label, url]) => (
                              <a key={`${task.task_id}-${label}`} href={url} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100 underline">
                                {label}
                              </a>
                            )) : <span className="text-xs text-slate-500">Resource currently unavailable</span>}
                            <span className="text-xs text-emerald-300">
                              +{task.points} XP
                            </span>
                            <Link to={`/assistant?topic=${encodeURIComponent(task.title)}`} className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-100">
                              Ask AI about this topic
                            </Link>
                            </div>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2">
                          <span className="text-xs text-slate-400">
                            Complete this checkpoint
                          </span>
                          <input
                            type="checkbox"
                            checked={Boolean(taskCompletionState[task.task_id])}
                            onChange={(event) =>
                              handleTaskToggle(task, event.target.checked)
                            }
                            className="h-5 w-5 rounded border-white/20 bg-slate-900 text-cyan-400 accent-cyan-400"
                          />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              Your AI-generated roadmap will appear here with a clear step-by-step path.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePathPage;
