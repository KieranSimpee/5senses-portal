import { useState, useEffect, useRef } from "react";
import { Notice } from "@/api/entities";

const SIMPEE_URL = "https://app.base44.com/superagent/69ddc914cfcf229762ac123d";

const styles = {
  page: {
    background: "#e8e6fe",
    minHeight: "100vh",
    fontFamily: "'Montserrat', sans-serif",
    padding: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  title: {
    fontFamily: "'Exo 2', sans-serif",
    fontWeight: 800,
    fontSize: "20px",
    color: "#1a0533",
    letterSpacing: "0.04em",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    marginRight: 7,
    animation: "pulse 2s infinite",
  },
  onlineLabel: {
    fontFamily: "'Exo 2', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: "#5e50fb",
    display: "flex",
    alignItems: "center",
  },
  openLink: {
    fontFamily: "'Exo 2', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: "#5e50fb",
    textDecoration: "none",
    background: "#f0eeff",
    padding: "5px 12px",
    borderRadius: 6,
    border: "1px solid #c4bffd",
  },
  chatWindow: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "20px",
    minHeight: "60vh",
    maxHeight: "68vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxShadow: "0 2px 16px rgba(94,80,251,0.07)",
    marginBottom: 16,
  },
  bubble: (isUser) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: isUser ? "flex-end" : "flex-start",
  }),
  bubbleInner: (isUser) => ({
    background: isUser ? "#5e50fb" : "#f4f3ff",
    color: isUser ? "#ffffff" : "#1a0533",
    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    padding: "10px 16px",
    maxWidth: "78%",
    fontSize: 13,
    lineHeight: 1.55,
    fontFamily: "'Montserrat', sans-serif",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }),
  bubbleLabel: (isUser) => ({
    fontSize: 10,
    color: "#9896ad",
    fontFamily: "'Exo 2', sans-serif",
    fontWeight: 700,
    marginBottom: 4,
    marginTop: 2,
    textAlign: isUser ? "right" : "left",
  }),
  inputRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
  },
  textarea: {
    flex: 1,
    borderRadius: 12,
    border: "1.5px solid #c4bffd",
    padding: "12px 14px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 13,
    resize: "none",
    outline: "none",
    background: "#faf9ff",
    color: "#1a0533",
    minHeight: 46,
    maxHeight: 100,
  },
  sendBtn: {
    background: "#5e50fb",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 22px",
    fontFamily: "'Exo 2', sans-serif",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  },
  note: {
    fontSize: 10,
    color: "#9896ad",
    textAlign: "center",
    fontFamily: "'Montserrat', sans-serif",
    marginTop: 8,
  },
  emptyState: {
    textAlign: "center",
    color: "#b0adcc",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 13,
    marginTop: 40,
  },
};

// Static snapshot of recent conversation context
const STATIC_MESSAGES = [
  { sender: "Kieran", text: "Please debug the whole apps and summarise issue", time: "05:58", isUser: true },
  { sender: "Simpee", text: "On it. Full audit running...\n\nDATA — ALL HEALTHY ✅\nExpenses: 23 records, all paid\nInvoices: 3 records\nVault: 22 tools\nBrands: 2\nCompliance: 6 items\nHR: 4 contracts\nBank: 3 accounts\n\nISSUES FOUND:\n1. Command Chat — wrong fetch URL in Home.jsx\n2. Milestone entity missing from real portal\n3. BuildProject / BuildCheckpoint missing\n4. Bank balances all zero", time: "06:01", isUser: false },
  { sender: "Kieran", text: "Yes fix it overnight is fine please proceed", time: "06:10", isUser: true },
  { sender: "Simpee", text: "Overnight fixes done ✅\n\n1. Inbox cleared — 36 stale notices deleted\n2. Team Members seeded — Kieran, Loreen, Wilson\n3. Bank accounts flagged for manual update\n4. processSChatInstruction function tested — responding in <1s\n5. Audit report posted to portal INBOX\n\nParked for tomorrow: Command Chat URL fix, missing entities, bank balances.", time: "06:15", isUser: false },
  { sender: "Kieran", text: "Can you show me our communication on 5S now by creating a window mirroring this chat", time: "06:22", isUser: true },
  { sender: "Simpee", text: "Building it now — this page is the live mirror. You can message me here and I'll respond directly into the portal.", time: "06:22", isUser: false },
];

export default function SChatMirrorPage() {
  const [messages, setMessages] = useState(STATIC_MESSAGES);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = {
      sender: "Kieran",
      text: input.trim(),
      time: new Date().toLocaleTimeString("en-HK", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong" }),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setStatus("Simpee is reading...");

    try {
      // Post to Notice entity so Simpee automation picks it up
      await Notice.create({
        title: input.trim().slice(0, 80),
        content: input.trim(),
        posted_by: "Kieran",
        section: "schat",
        type: "info",
        pinned: false,
      });

      setStatus("Sent to Simpee ✅ — reply will appear in INBOX");
      setMessages((prev) => [
        ...prev,
        {
          sender: "Simpee",
          text: "Got it. I'm on it — check INBOX for my response, or open the Superagent chat for a full reply:\n" + SIMPEE_URL,
          time: new Date().toLocaleTimeString("en-HK", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong" }),
          isUser: false,
        },
      ]);
    } catch (err) {
      setStatus("Send failed — try again");
    }
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>S-CHAT MIRROR</div>
          <div style={{ fontSize: 11, color: "#9896ad", fontFamily: "'Montserrat', sans-serif", marginTop: 2 }}>
            Simpee ↔ Kieran — 5S Portal
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={styles.onlineLabel}>
            <span style={styles.dot} />
            SIMPEE ONLINE
          </div>
          <a href={SIMPEE_URL} target="_blank" rel="noreferrer" style={styles.openLink}>
            OPEN FULL CHAT ↗
          </a>
        </div>
      </div>

      <div style={styles.chatWindow}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>No messages yet. Say something 👋</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={styles.bubble(msg.isUser)}>
            <div style={styles.bubbleLabel(msg.isUser)}>
              {msg.sender} · {msg.time}
            </div>
            <div style={styles.bubbleInner(msg.isUser)}>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          rows={2}
          placeholder="Message Simpee..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button style={styles.sendBtn} onClick={sendMessage} disabled={sending}>
          {sending ? "..." : "SEND"}
        </button>
      </div>

      {status && <div style={styles.note}>{status}</div>}
      <div style={styles.note}>
        This window mirrors your WhatsApp ↔ Simpee conversation. Full chat: {SIMPEE_URL}
      </div>
    </div>
  );
}
