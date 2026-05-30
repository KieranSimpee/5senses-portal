import { useState, useEffect, useRef } from "react";
import { Notice } from "@/api/entities";
import { useCurrentUser } from "@/api/auth";

const SIMPEE_CHAT_URL = "https://app.base44.com/superagent/69ddc914cfcf229762ac123d";

export default function SChatMirrorPage() {
  const { data: currentUser } = useCurrentUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const loadMessages = async () => {
    try {
      const records = await Notice.filter({ section: "schat" }, "-created_date", 100);
      const sorted = [...records].reverse();
      setMessages(sorted.map((r) => ({
        id: r.id,
        sender: r.posted_by || "Unknown",
        isUser: r.posted_by === "Kieran",
        text: r.content || r.title || "",
        time: r.created_date
          ? new Date(r.created_date).toLocaleTimeString("en-HK", {
              hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong",
            })
          : "",
      })));
    } catch (e) {
      console.error("Failed to load messages", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
    // Poll every 15 seconds for new messages from Simpee
    pollRef.current = setInterval(loadMessages, 15000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    setStatusText("Sending to Simpee...");

    try {
      await Notice.create({
        title: `Kieran — ${new Date().toLocaleTimeString("en-HK", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Hong_Kong" })}`,
        content: text,
        posted_by: "Kieran",
        section: "schat",
        type: "info",
        pinned: false,
      });

      setStatusText("Sent ✅ — Simpee will reply shortly");
      await loadMessages();
    } catch (e) {
      setStatusText("Send failed — please try again");
    }
    setSending(false);
    setTimeout(() => setStatusText(""), 4000);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      background: "#e8e6fe",
      minHeight: "100vh",
      fontFamily: "'Montserrat', sans-serif",
      padding: "24px 28px",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{
            fontFamily: "'Exo 2', sans-serif", fontWeight: 800,
            fontSize: 20, color: "#1a0533", letterSpacing: "0.05em",
          }}>
            S-CHAT MIRROR
          </div>
          <div style={{ fontSize: 11, color: "#9896ad", marginTop: 3 }}>
            Simpee ↔ Kieran · 5S Portal · Live
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Status dots */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            background: "#f4f3ff", borderRadius: 10, padding: "6px 14px",
            border: "1px solid #dddafc",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#22c55e", animation: "pulse 2s infinite",
              }} />
              <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 10, fontWeight: 800, color: "#1a0533" }}>
                SIMPEE
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#22c55e", animation: "pulse 2.4s infinite",
              }} />
              <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 10, fontWeight: 800, color: "#1a0533" }}>
                PORTAL
              </span>
            </div>
          </div>
          <a href={SIMPEE_CHAT_URL} target="_blank" rel="noreferrer" style={{
            fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 11,
            color: "#5e50fb", background: "#f0eeff", padding: "7px 14px",
            borderRadius: 8, border: "1px solid #c4bffd", textDecoration: "none",
          }}>
            OPEN FULL CHAT ↗
          </a>
        </div>
      </div>

      {/* Chat window */}
      <div style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: "20px",
        minHeight: "62vh",
        maxHeight: "65vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 2px 20px rgba(94,80,251,0.08)",
        marginBottom: 14,
      }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#b0adcc", fontSize: 13, marginTop: 40 }}>
            Loading messages...
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#b0adcc", fontSize: 13, marginTop: 60 }}>
            No messages yet. Say something to Simpee 👋
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.isUser ? "flex-end" : "flex-start",
          }}>
            <div style={{
              fontSize: 10, fontFamily: "'Exo 2', sans-serif", fontWeight: 700,
              color: "#b0adcc", marginBottom: 4,
              textAlign: msg.isUser ? "right" : "left",
            }}>
              {msg.sender} · {msg.time}
            </div>
            <div style={{
              background: msg.isUser ? "#5e50fb" : "#f4f3ff",
              color: msg.isUser ? "#ffffff" : "#1a0533",
              borderRadius: msg.isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 16px",
              maxWidth: "76%",
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: "'Montserrat', sans-serif",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              boxShadow: msg.isUser
                ? "0 2px 8px rgba(94,80,251,0.18)"
                : "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          rows={2}
          placeholder="Message Simpee... (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          style={{
            flex: 1,
            borderRadius: 12,
            border: "1.5px solid #c4bffd",
            padding: "12px 16px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            resize: "none",
            outline: "none",
            background: "#faf9ff",
            color: "#1a0533",
            lineHeight: 1.5,
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          style={{
            background: sending || !input.trim() ? "#c4bffd" : "#5e50fb",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 24px",
            fontFamily: "'Exo 2', sans-serif",
            fontWeight: 800,
            fontSize: 13,
            cursor: sending || !input.trim() ? "not-allowed" : "pointer",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            transition: "background 0.2s",
          }}
        >
          {sending ? "..." : "SEND"}
        </button>
      </div>

      {/* Status + note */}
      {statusText && (
        <div style={{
          textAlign: "center", fontSize: 11, color: "#5e50fb",
          fontFamily: "'Montserrat', sans-serif", marginTop: 8, fontWeight: 600,
        }}>
          {statusText}
        </div>
      )}
      <div style={{
        textAlign: "center", fontSize: 10, color: "#b0adcc",
        fontFamily: "'Montserrat', sans-serif", marginTop: 6,
      }}>
        Refreshes every 15s · Simpee responds via WhatsApp + portal INBOX · Full chat: {SIMPEE_CHAT_URL}
      </div>
    </div>
  );
}
