import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiBookOpen, FiChevronDown, FiLoader, FiRefreshCw, FiSend, FiShield, FiTrash2 } from "react-icons/fi";
import { clearAssistantMessages, escalateAssistantQuestion, getAssistantMessages, sendAssistantMessage } from "../services/api";
import { useToast } from "../components/ToastProvider";

const AssistantPage = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef(null);
  const { pushToast } = useToast();
  const topicParam = searchParams.get("topic") || "";
  const topic = topicParam || "your current roadmap topic";
  const suggestions = [`Explain ${topic} simply`, `Give me an example of ${topic}`, `Give me a practice question about ${topic}`, `Give me a hint for ${topic}`];

  useEffect(() => {
    getAssistantMessages().then((response) => setMessages(response.data.messages || [])).catch(() => pushToast("Unable to load assistant history", "error")).finally(() => setLoading(false));
  }, [pushToast]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  const handleSend = async (eventOrQuestion) => {
    if (eventOrQuestion?.preventDefault) eventOrQuestion.preventDefault();
    const question = typeof eventOrQuestion === "string" ? eventOrQuestion : draft.trim();
    if (!question || sending) return;
    setSending(true);
    try {
      const response = await sendAssistantMessage(question, topicParam);
      setMessages((current) => [...current, { role: "user", body: question }, response.data.message]);
      setDraft("");
      setEscalated(false);
    } catch {
      pushToast("The assistant is unavailable right now. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearAssistantMessages();
      setMessages([]);
      setEscalated(false);
    } catch {
      pushToast("Unable to clear assistant history", "error");
    }
  };

  const handleEscalate = async () => {
    const question = [...messages].reverse().find((message) => message.role === "user");
    const response = [...messages].reverse().find((message) => message.role === "assistant");
    if (!question || !response) return;
    try {
      await escalateAssistantQuestion({ question: question.body, assistant_response: response.body });
      setEscalated(true);
      pushToast("Your question was sent to the admin team", "info");
    } catch {
      pushToast("Unable to contact the admin team", "error");
    }
  };

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  return <div className="space-y-6 p-6 lg:p-8"><div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-900 to-cyan-500/10 p-8"><p className="text-sm uppercase tracking-[0.3em] text-violet-200">Learning companion</p><h1 className="mt-2 text-3xl font-semibold text-white">AI Assistant</h1><p className="mt-3 text-slate-300">Ask for an explanation, example, hint, comparison, or practice task. Follow-up questions keep their conversation context.</p></div><section className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-slate-900/70 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"><div className="flex items-center gap-2 text-sm text-cyan-200"><FiBookOpen /> Context: <span className="font-semibold text-white">{topic}</span></div><div className="flex gap-2"><button title="Clear conversation" onClick={handleClear} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/10"><FiTrash2 /></button><button title="Show suggested prompts" onClick={() => setShowSuggestions((current) => !current)} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/10"><FiChevronDown className={showSuggestions ? "rotate-180" : ""} /></button></div></div>{showSuggestions && <div className="flex flex-wrap gap-2 py-4">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => handleSend(suggestion)} disabled={sending} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-left text-xs text-cyan-100 disabled:opacity-50">{suggestion}</button>)}</div>}<div ref={scrollRef} className="min-h-[360px] max-h-[52vh] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-4">{loading ? <p className="py-28 text-center text-slate-400">Loading assistant history...</p> : !messages.length ? <p className="py-28 text-center text-slate-400">Ask about {topic} to get started.</p> : messages.map((message, index) => <div key={`${message.id || message.created_at || index}-${index}`} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "ml-auto bg-cyan-500/20 text-cyan-50" : "bg-white/10 text-slate-200"}`}><p className="whitespace-pre-wrap">{message.body}</p>{message.role === "assistant" && index === messages.length - 1 && <button onClick={() => handleSend(lastUser?.body || "Explain that again")} disabled={sending} className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-200"><FiRefreshCw /> Retry response</button>}</div>)}{sending && <div className="flex items-center gap-2 text-sm text-slate-400"><FiLoader className="animate-spin" /> Tutor is thinking...</div>}</div><form onSubmit={handleSend} className="mt-4 flex gap-2"><input aria-label="Ask AI Assistant" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder={`Ask about ${topic}...`} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={sending} /><button title="Send question" disabled={sending || !draft.trim()} className="rounded-xl bg-cyan-500 px-4 text-slate-950 disabled:opacity-50"><FiSend /></button></form>{lastAssistant && <button onClick={handleEscalate} disabled={escalated} className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-100 disabled:opacity-50"><FiShield />{escalated ? "Admin contacted" : "I still need help"}</button>}</section></div>;
};

export default AssistantPage;