import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiMessageCircle, FiRefreshCw, FiSearch, FiSend, FiUsers } from "react-icons/fi";
import { deleteUser, getAdminAnalytics, getAdminStudent, getAdminUsers, getMessages, sendMessage, trainModel } from "../services/api";
import { useToast } from "../components/ToastProvider";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const { pushToast } = useToast();

  const loadStudents = useCallback(async () => {
    try {
      const [studentsResponse, statsResponse] = await Promise.all([getAdminUsers(), getAdminAnalytics()]);
      setStudents(studentsResponse.data.users || []);
      setAdminStats(statsResponse.data);
    } catch {
      pushToast("Unable to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const openStudent = async (student) => {
    setDetailLoading(true);
    try {
      const [detailResponse, messageResponse] = await Promise.all([getAdminStudent(student.id), getMessages(student.id)]);
      setSelected(detailResponse.data.student);
      setMessages(messageResponse.data.messages || []);
    } catch {
      pushToast("Unable to load this student", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => [student.username, student.full_name, student.email, student.interest].filter(Boolean).some((value) => value.toLowerCase().includes(query)));
  }, [search, students]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selected || !draft.trim()) return;
    try {
      const response = await sendMessage(selected.id, draft.trim());
      setMessages((current) => [...current, response.data.message]);
      setDraft("");
    } catch {
      pushToast("Unable to send message", "error");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteUser(selected.id);
      setStudents((current) => current.filter((student) => student.id !== selected.id));
      setSelected(null);
      pushToast("Student removed", "info");
    } catch {
      pushToast("Unable to remove student", "error");
    }
  };

  const handleTrain = async () => {
    try {
      const response = await trainModel();
      pushToast(response.data.message, "info");
    } catch {
      pushToast("Training failed", "error");
    }
  };

  const completedTasks = selected?.tasks?.filter((task) => task.completed).length || 0;
  const totalTasks = selected?.tasks?.length || 0;
  const progress = Math.round(selected?.overall_progress || 0);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="rounded-[32px] border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-slate-900 to-cyan-500/10 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Admin workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Student success overview</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Monitor roadmaps, progress, and conversations from one focused workspace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"><FiUsers className="text-cyan-300" /><p className="mt-4 text-sm text-slate-400">Registered students</p><p className="text-2xl font-semibold text-white">{students.length}</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"><FiBookOpen className="text-violet-300" /><p className="mt-4 text-sm text-slate-400">Active learning paths</p><p className="text-2xl font-semibold text-white">{students.filter((student) => student.learning_path_title).length}</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"><FiCheckCircle className="text-emerald-300" /><p className="mt-4 text-sm text-slate-400">Average progress</p><p className="text-2xl font-semibold text-white">{students.length ? Math.round(students.reduce((sum, student) => sum + (student.overall_progress || 0), 0) / students.length) : 0}%</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"><FiMessageCircle className="text-amber-200" /><p className="mt-4 text-sm text-slate-400">Open AI escalations</p><p className="text-2xl font-semibold text-white">{adminStats?.open_escalations || 0}</p></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-xl font-semibold text-white">All students</h2><p className="mt-1 text-sm text-slate-400">Search by name, email, or learning interest.</p></div>
            <div className="flex gap-2"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-slate-400 sm:max-w-xs"><FiSearch /><input aria-label="Search students" className="min-w-0 w-full bg-transparent text-sm text-white outline-none" placeholder="Search students" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button title="Refresh students" onClick={loadStudents} className="rounded-2xl border border-white/10 px-3 text-slate-300 hover:bg-white/10"><FiRefreshCw /></button></div>
          </div>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-white/10 text-slate-400"><tr><th className="px-3 py-3 font-medium">Student</th><th className="px-3 py-3 font-medium">Learning path</th><th className="px-3 py-3 font-medium">Progress</th><th className="px-3 py-3 font-medium">Tasks</th></tr></thead><tbody>{filteredStudents.map((student) => <tr key={student.id} onClick={() => openStudent(student)} className={`cursor-pointer border-b border-white/5 transition hover:bg-cyan-500/10 ${selected?.id === student.id ? "bg-cyan-500/10" : ""}`}><td className="px-3 py-4"><p className="font-semibold text-white">{student.full_name || student.username}</p><p className="text-xs text-slate-400">{student.email}</p></td><td className="px-3 py-4 text-slate-300">{student.learning_path_title || "Not generated"}</td><td className="px-3 py-4"><div className="flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${Math.min(100, student.overall_progress || 0)}%` }} /></div><span className="text-slate-300">{Math.round(student.overall_progress || 0)}%</span></div></td><td className="px-3 py-4 text-slate-300">{student.completed_tasks || 0}/{student.total_tasks || 0}</td></tr>)}</tbody></table>{!loading && !filteredStudents.length && <p className="py-10 text-center text-slate-400">No students match this search.</p>}{loading && <p className="py-10 text-center text-slate-400">Loading student records...</p>}</div>
        </section>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 sm:p-6">
          {!selected ? <div className="flex min-h-[420px] flex-col items-center justify-center text-center text-slate-400"><FiUsers className="text-4xl text-cyan-300" /><p className="mt-4 text-lg text-white">Select a student</p><p className="mt-2 max-w-xs text-sm">Open a record to inspect the roadmap, task status, and conversation.</p></div> : detailLoading ? <p className="py-20 text-center text-slate-400">Loading student details...</p> : <>
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Student profile</p><h2 className="mt-2 text-2xl font-semibold text-white">{selected.full_name || selected.username}</h2><p className="text-sm text-slate-400">{selected.email} · Joined {formatDate(selected.created_at)}</p></div><button onClick={handleDelete} className="rounded-xl border border-rose-400/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10">Remove</button></div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-white/5 p-3 text-slate-300">{selected.college || "College not set"}</div><div className="rounded-2xl bg-white/5 p-3 text-slate-300">{selected.course || selected.branch || "Course not set"}</div></div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex justify-between text-sm"><span className="text-slate-300">Roadmap progress</span><span className="text-cyan-200">{progress}%</span></div><div className="mt-3 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${Math.min(100, progress)}%` }} /></div><p className="mt-3 text-sm text-slate-400">{selected.learning_path_title || "No roadmap generated yet"}</p></div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-white/5 p-3 text-slate-300">Quiz average: {selected.analytics?.quiz_average || 0}%</div><div className="rounded-xl bg-white/5 p-3 text-slate-300">Attempts: {selected.analytics?.quiz_count || 0}</div></div>
            <div className="mt-5">{selected.analytics?.escalations?.length > 0 && <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100"><p className="font-semibold">AI help requested</p><p className="mt-1">{selected.analytics.escalations[0].question}</p><p className="mt-2 text-amber-200/70">Previous AI response: {selected.analytics.escalations[0].assistant_response}</p></div>}<h3 className="font-semibold text-white">Activity status <span className="text-sm font-normal text-slate-400">{completedTasks}/{totalTasks} completed</span></h3><div className="mt-3 max-h-40 space-y-2 overflow-y-auto">{selected.tasks?.length ? selected.tasks.map((task) => <div key={task.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"><span className="truncate text-slate-300">{task.title}</span><span className={task.completed ? "text-emerald-300" : "text-amber-200"}>{task.completed ? "Completed" : "Pending"}</span></div>) : <p className="text-sm text-slate-400">No activities recorded yet.</p>}</div></div>
            <div className="mt-5 border-t border-white/10 pt-5"><div className="mb-3 flex items-center gap-2"><FiMessageCircle className="text-cyan-300" /><h3 className="font-semibold text-white">Message student</h3></div><div className="max-h-36 space-y-2 overflow-y-auto">{messages.length ? messages.map((message) => <div key={message.id} className={`rounded-xl px-3 py-2 text-sm ${message.sender_id === selected.id ? "bg-white/5 text-slate-300" : "ml-6 bg-cyan-500/15 text-cyan-100"}`}><p>{message.body}</p><p className="mt-1 text-[11px] text-slate-500">{formatDate(message.created_at)}</p></div>) : <p className="text-sm text-slate-400">Start the conversation with this student.</p>}</div><form onSubmit={handleSend} className="mt-3 flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" placeholder="Write a message..." value={draft} onChange={(event) => setDraft(event.target.value)} /><button title="Send message" className="rounded-xl bg-cyan-500 px-3 text-slate-950"><FiSend /></button></form></div>
          </>}
        </motion.section>
      </div>
      <div className="flex justify-end"><button onClick={handleTrain} className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200">Retrain recommendation model</button></div>
    </div>
  );
};

export default AdminPage;