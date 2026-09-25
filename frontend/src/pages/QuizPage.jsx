import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiLoader } from "react-icons/fi";
import { getQuiz, getQuizzes, submitQuiz } from "../services/api";
import { useToast } from "../components/ToastProvider";

const QuizPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { pushToast } = useToast();

  useEffect(() => {
    getQuizzes().then((response) => setCatalog(response.data.quizzes || [])).catch(() => pushToast("Unable to load quizzes", "error")).finally(() => setLoading(false));
  }, [pushToast]);

  const startQuiz = async (quizId) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await getQuiz(quizId);
      setQuiz(response.data.quiz);
      setAnswers({});
      setQuestionIndex(0);
    } catch {
      pushToast("Unable to open this quiz", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const response = await submitQuiz({ quiz_id: quiz.id, answers });
      setResult(response.data);
    } catch {
      pushToast("We couldn't submit your quiz. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = quiz?.questions?.[questionIndex];
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-amber-500/10 via-slate-900 to-cyan-500/10 p-8"><p className="text-sm uppercase tracking-[0.3em] text-amber-200">Practice lab</p><h1 className="mt-2 text-3xl font-semibold text-white">Take a quiz</h1><p className="mt-3 text-slate-300">Check your understanding with short questions from your learning domain.</p></div>
      {loading ? <div className="flex min-h-48 items-center justify-center rounded-[32px] border border-white/10 bg-slate-900/70 text-cyan-200"><FiLoader className="mr-2 animate-spin" /> Loading quiz content...</div> : !quiz ? <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold text-white">Available quizzes</h2><p className="mt-2 text-sm text-slate-400">Choose a quiz connected to your selected learning domain.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{catalog.map((item) => <button key={item.id} onClick={() => startQuiz(item.id)} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-300/50 hover:bg-cyan-500/10"><p className="font-semibold text-white">{item.title}</p><p className="mt-2 text-sm text-slate-400">{item.domain} · {item.question_count} questions</p></button>)}</div>{!catalog.length && <p className="mt-6 text-slate-400">Generate a learning path first to create a domain quiz.</p>}</section> : result ? <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6"><div className="flex items-center gap-3"><FiCheckCircle className="text-emerald-300" size={28} /><div><h2 className="text-2xl font-semibold text-white">Quiz complete</h2><p className="text-slate-400">{result.feedback}</p></div></div><p className="mt-6 text-5xl font-semibold text-cyan-200">{result.score}/{result.total}</p><div className="mt-6 space-y-3">{result.attempt.answers.map((answer, index) => <div key={answer.question_id} className={`rounded-2xl border p-4 ${answer.correct ? "border-emerald-400/20 bg-emerald-500/10" : "border-rose-400/20 bg-rose-500/10"}`}><p className="font-medium text-white">Question {index + 1}: {answer.correct ? "Correct" : "Needs review"}</p><p className="mt-1 text-sm text-slate-300">{answer.explanation}</p></div>)}</div><Link to="/analytics" className="mt-6 inline-flex rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950">View analytics</Link></section> : <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6"><div className="flex items-center justify-between text-sm text-slate-400"><span>{quiz.title}</span><span>Question {questionIndex + 1} of {quiz.questions.length}</span></div><div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${((questionIndex + 1) / quiz.questions.length) * 100}%` }} /></div><div className="mt-8"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{currentQuestion.topic}</p><h2 className="mt-3 text-2xl font-semibold text-white">{currentQuestion.question}</h2><div className="mt-6 grid gap-3">{currentQuestion.options.map((option, index) => <button key={option} onClick={() => setAnswers({ ...answers, [currentQuestion.id]: index })} className={`rounded-2xl border p-4 text-left transition ${answers[currentQuestion.id] === index ? "border-cyan-300 bg-cyan-500/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>{option}</button>)}</div></div><div className="mt-8 flex flex-wrap justify-between gap-3"><button disabled={questionIndex === 0} onClick={() => setQuestionIndex((current) => current - 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-300 disabled:opacity-40"><FiArrowLeft /> Previous</button>{questionIndex < quiz.questions.length - 1 ? <button onClick={() => setQuestionIndex((current) => current + 1)} className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Next <FiArrowRight /></button> : <button disabled={submitting} onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50">{submitting && <FiLoader className="animate-spin" />} Submit quiz</button>}</div></section>}
    </div>
  );
};

export default QuizPage;