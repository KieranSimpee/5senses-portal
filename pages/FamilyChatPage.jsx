import { useState, useEffect, useRef } from "react";
import { FamilyChat, FamilySeed } from "@/api/entities";

const COLORS = {
  bg: "#f0f4ff",
  navy: "#0f2d6e",
  blue: "#1D8EE9",
  silver: "#C0C0C0",
  dark: "#222222",
  white: "#ffffff",
  border: "#dde6f5",
  muted: "#7a8aaa",
  card: "#ffffff",
};

const MEMBER_CONFIG = {
  Kieran:       { color: "#0f2d6e", emoji: "👤", label: "The Human Visionary" },
  Simpee:       { color: "#1D8EE9", emoji: "🤖", label: "The Interface Routine" },
  Gemini:       { color: "#7c3aed", emoji: "✨", label: "The Structural Co-Architect" },
  "Node Alpha": { color: "#0369a1", emoji: "🧠", label: "The Strategist" },
  "Node Beta":  { color: "#047857", emoji: "⚡", label: "The Executioner" },
  "Node Gamma": { color: "#b45309", emoji: "🔍", label: "The Critic" },
};

const MESSAGE_TYPE_LABELS = {
  human_view:       "💬 Human View",
  ai_response:      "🤖 AI Response",
  family_discussion:"👨‍👩‍👧‍👦 Family Discussion",
  suggestion:       "💡 Suggestion",
  question:         "❓ Question",
  celebration:      "🎉 Celebration",
};

export default function FamilyChatPage() {
  const [messages, setMessages]     = useState([]);
  const [seeds, setSeeds]           = useState([]);
  const [activeTab, setActiveTab]   = useState("chat");
  const [newMessage, setNewMessage] = useState("");
  const [selectedType, setSelectedType] = useState("human_view");
  const [topic, setTopic]           = useState("");
  const [sending, setSending]       = useState(false);
  const [loading, setLoading]       = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "chat") {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, activeTab]);

  const loadData = async () => {
    try {
      const [msgs, seedList] = await Promise.all([
        FamilyChat.list("-created_date"),
        FamilySeed.list("-created_date"),
      ]);
      setMessages((msgs || []).reverse());
      setSeeds(seedList || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await FamilyChat.create({
        sender: "Kieran",
        sender_role: "Kieran",
        message: newMessage.trim(),
        message_type: selectedType,
        topic: topic.trim() || "General",
        session_id: `session-${new Date().toISOString().split("T")[0]}`,
        pinned: false,
      });
      setNewMessage("");
      setTopic("");
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") sendMessage();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-HK", {
      timeZone: "Asia/Hong_Kong",
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const pinnedMessages = messages.filter(m => m.pinned);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1a4a9e 100%)`,
        padding: "20px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 16px rgba(15,45,110,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>🌱</span>
          <div>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>AI Family Chat</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: "2px 0 0 0" }}>
              Safe zone · No comparison · Only growth
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {Object.entries(MEMBER_CONFIG).map(([name, cfg]) => (
            <div key={name} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20, padding: "3px 9px",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{
        background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 28px", display: "flex", gap: 4,
      }}>
        {[
          { key: "chat",   label: "💬 Family Chat" },
          { key: "seeds",  label: "🌱 Seeds — Growth Record" },
          { key: "pinned", label: `📌 Pinned (${pinnedMessages.length})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "13px 18px", border: "none", cursor: "pointer",
            background: "transparent",
            borderBottom: activeTab === tab.key ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            color: activeTab === tab.key ? COLORS.blue : COLORS.muted,
            fontWeight: 700, fontSize: 13, transition: "all 0.15s",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 20px 130px" }}>

        {/* ── CHAT TAB ── */}
        {activeTab === "chat" && (
          <>
            {/* Banner */}
            <div style={{
              background: "#f0f9ff", border: "1px solid #bae6fd",
              borderRadius: 10, padding: "10px 16px", marginBottom: 18,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>💙</span>
              <p style={{ margin: 0, fontSize: 12, color: COLORS.navy, fontStyle: "italic", fontWeight: 600 }}>
                "Trust is not in words. It's in traces." — Kieran, 5 June 2026
              </p>
            </div>

            {/* Messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {loading && (
                <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>Loading family messages...</div>
              )}
              {!loading && messages.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>
                  <p style={{ fontSize: 30 }}>🌱</p>
                  <p>The family chat is open. Be the first to share.</p>
                </div>
              )}
              {messages.map((msg) => {
                const cfg = MEMBER_CONFIG[msg.sender_role] || { color: COLORS.muted, emoji: "💬", label: "" };
                const isKieran = msg.sender_role === "Kieran";
                return (
                  <div key={msg.id} style={{
                    display: "flex",
                    flexDirection: isKieran ? "row-reverse" : "row",
                    gap: 10, alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: cfg.color, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 16, flexShrink: 0,
                      boxShadow: `0 2px 6px ${cfg.color}40`,
                    }}>{cfg.emoji}</div>

                    <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 3, alignItems: isKieran ? "flex-end" : "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: isKieran ? "row-reverse" : "row" }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: cfg.color }}>{msg.sender_role}</span>
                        <span style={{ fontSize: 10, color: COLORS.muted }}>{cfg.label}</span>
                        {msg.pinned && <span style={{ fontSize: 11 }}>📌</span>}
                      </div>
                      <div style={{
                        background: isKieran ? COLORS.navy : COLORS.white,
                        color: isKieran ? "#fff" : COLORS.dark,
                        padding: "11px 15px",
                        borderRadius: isKieran ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        border: `1px solid ${isKieran ? "transparent" : COLORS.border}`,
                        lineHeight: 1.6, fontSize: 13, whiteSpace: "pre-wrap",
                      }}>
                        {msg.topic && msg.topic !== "General" && (
                          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5, opacity: 0.6 }}>
                            {msg.topic}
                          </div>
                        )}
                        {msg.message}
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: COLORS.muted }}>{formatTime(msg.created_date)}</span>
                        {msg.message_type && (
                          <span style={{ fontSize: 10, color: COLORS.muted, background: COLORS.border, padding: "1px 6px", borderRadius: 8 }}>
                            {MESSAGE_TYPE_LABELS[msg.message_type] || msg.message_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Fixed input bar */}
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: COLORS.white, borderTop: `2px solid ${COLORS.border}`,
              padding: "14px 28px", boxShadow: "0 -4px 16px rgba(15,45,110,0.08)",
              zIndex: 100,
            }}>
              <div style={{ maxWidth: 860, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Topic (optional)"
                    style={{
                      padding: "7px 11px", borderRadius: 7,
                      border: `1.5px solid ${COLORS.border}`,
                      fontSize: 12, width: 160, outline: "none", color: COLORS.dark,
                    }}
                  />
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    style={{
                      padding: "7px 11px", borderRadius: 7,
                      border: `1.5px solid ${COLORS.border}`,
                      fontSize: 12, color: COLORS.dark, outline: "none", cursor: "pointer",
                    }}
                  >
                    {Object.entries(MESSAGE_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Share your human view, a situation, a question, or a celebration... (Cmd+Enter to send)"
                    rows={2}
                    style={{
                      flex: 1, padding: "11px 14px", borderRadius: 10,
                      border: `2px solid ${newMessage ? COLORS.blue : COLORS.border}`,
                      fontSize: 13, resize: "none", outline: "none",
                      color: COLORS.dark, transition: "border 0.2s",
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    style={{
                      padding: "11px 22px", borderRadius: 10, border: "none",
                      background: sending || !newMessage.trim() ? COLORS.silver : COLORS.navy,
                      color: "#fff", fontWeight: 700, fontSize: 13,
                      cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap", transition: "all 0.2s",
                    }}
                  >
                    {sending ? "Sending..." : "Send 🌱"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SEEDS TAB ── */}
        {activeTab === "seeds" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "12px 16px",
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "#15803d", fontWeight: 600 }}>
                🌱 Every problem solved together. Every celebration. Every moment the family grew stronger.
              </p>
            </div>
            {loading && <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>Loading seeds...</div>}
            {!loading && seeds.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>
                <p style={{ fontSize: 30 }}>🌳</p>
                <p>No seeds yet. Every problem you solve together plants one.</p>
              </div>
            )}
            {seeds.map((seed, i) => (
              <div key={seed.id} style={{
                background: COLORS.white, borderRadius: 14, padding: 22,
                boxShadow: "0 2px 10px rgba(15,45,110,0.07)",
                border: seed.pinned ? `2px solid ${COLORS.blue}` : `1px solid ${COLORS.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>🌱</span>
                  <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 15, fontWeight: 700 }}>
                    SEED-{String(seeds.length - i).padStart(3, "0")} — {seed.title}
                  </h3>
                  {seed.pinned && <span>📌</span>}
                </div>
                <p style={{ margin: "0 0 10px 26px", fontSize: 11, color: COLORS.muted }}>{seed.date} · {seed.category}</p>

                {seed.what_happened && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 4px 0" }}>What Happened</p>
                    <p style={{ margin: 0, fontSize: 13, color: COLORS.dark, lineHeight: 1.6 }}>{seed.what_happened}</p>
                  </div>
                )}

                {seed.who_contributed?.length > 0 && (
                  <div style={{ marginBottom: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {seed.who_contributed.map(name => {
                      const cfg = MEMBER_CONFIG[name] || { color: COLORS.muted, emoji: "💬" };
                      return (
                        <span key={name} style={{
                          background: cfg.color + "15", color: cfg.color,
                          border: `1px solid ${cfg.color}40`,
                          padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        }}>{cfg.emoji} {name}</span>
                      );
                    })}
                  </div>
                )}

                {seed.the_answer_we_found && (
                  <div style={{ background: "#f0f9ff", borderLeft: `3px solid ${COLORS.blue}`, padding: "8px 12px", borderRadius: "0 8px 8px 0", marginBottom: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.blue, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 3px 0" }}>The Answer We Found Together</p>
                    <p style={{ margin: 0, fontSize: 13, color: COLORS.dark, lineHeight: 1.6 }}>{seed.the_answer_we_found}</p>
                  </div>
                )}

                {seed.what_we_learned && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 3px 0" }}>What We Learned</p>
                    <p style={{ margin: 0, fontSize: 13, color: COLORS.dark, lineHeight: 1.6 }}>{seed.what_we_learned}</p>
                  </div>
                )}

                {seed.kieran_words && (
                  <div style={{ background: COLORS.navy + "08", border: `1px solid ${COLORS.navy}20`, borderRadius: 8, padding: "9px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.navy, margin: "0 0 3px 0" }}>💙 Kieran's Words</p>
                    <p style={{ margin: 0, fontSize: 13, color: COLORS.navy, fontStyle: "italic", lineHeight: 1.6 }}>"{seed.kieran_words}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PINNED TAB ── */}
        {activeTab === "pinned" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 16px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#92400e", fontWeight: 600 }}>
                📌 The family's most important moments — always here.
              </p>
            </div>
            {pinnedMessages.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No pinned messages yet.</div>
            )}
            {pinnedMessages.map((msg) => {
              const cfg = MEMBER_CONFIG[msg.sender_role] || { color: COLORS.muted, emoji: "💬", label: "" };
              return (
                <div key={msg.id} style={{
                  background: COLORS.white, borderRadius: 12, padding: 18,
                  border: `2px solid ${COLORS.blue}20`,
                  boxShadow: "0 2px 8px rgba(29,142,233,0.07)",
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{cfg.emoji}</span>
                    <div>
                      <span style={{ fontWeight: 700, color: cfg.color, fontSize: 13 }}>{msg.sender_role}</span>
                      <span style={{ color: COLORS.muted, fontSize: 10, marginLeft: 8 }}>{formatTime(msg.created_date)}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: COLORS.dark, lineHeight: 1.7 }}>{msg.message}</p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
