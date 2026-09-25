import { useEffect, useState } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import { getAdminContacts, getMessages, sendMessage } from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminContacts();
        const contacts = response.data.admins || [];
        setAdmins(contacts);
        if (contacts[0]) setAdminId(String(contacts[0].id));
      } catch {
        pushToast("Unable to load admin contacts", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pushToast]);

  useEffect(() => {
    if (!adminId) return;
    getMessages(adminId)
      .then((response) => setMessages(response.data.messages || []))
      .catch(() => pushToast("Unable to load conversation", "error"));
  }, [adminId, pushToast]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!adminId || !draft.trim()) return;
    try {
      const response = await sendMessage(adminId, draft.trim());
      setMessages((current) => [...current, response.data.message]);
      setDraft("");
    } catch {
      pushToast("Unable to send message", "error");
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Support chat</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Talk with your learning team</h1>
        <p className="mt-3 text-slate-300">Ask questions about your roadmap, activities, or next steps.</p>
      </div>
      <section className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300"><FiMessageCircle /></div><div><h2 className="font-semibold text-white">Admin conversation</h2><p className="text-sm text-slate-400">Messages are saved to your account.</p></div></div><select aria-label="Choose admin" className="rounded-xl border border-cyan-400/30 bg-slate-800 px-3 py-2 text-sm text-white outline-none" value={adminId} onChange={(event) => setAdminId(event.target.value)} disabled={!admins.length}>{admins.map((admin) => <option key={admin.id} value={admin.id}>{admin.username}</option>)}</select></div>
        <div className="mt-6 min-h-[320px] space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">{loading ? <p className="py-24 text-center text-slate-400">Loading contacts...</p> : !admins.length ? <p className="py-24 text-center text-slate-400">No admin contact is available yet.</p> : !messages.length ? <p className="py-24 text-center text-slate-400">No messages yet. Start the conversation.</p> : messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.sender_id === user?.id ? "ml-auto bg-cyan-500/20 text-cyan-50" : "bg-white/10 text-slate-200"}`}><p>{message.body}</p><p className="mt-1 text-[11px] text-slate-500">{new Date(message.created_at).toLocaleString()}</p></div>)}</div>
        <form onSubmit={handleSend} className="mt-4 flex gap-2"><input aria-label="Message" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Write a message..." value={draft} onChange={(event) => setDraft(event.target.value)} disabled={!adminId} /><button title="Send message" className="rounded-xl bg-cyan-500 px-4 text-slate-950 disabled:opacity-50" disabled={!adminId || !draft.trim()}><FiSend /></button></form>
      </section>
    </div>
  );
};

export default ChatPage;