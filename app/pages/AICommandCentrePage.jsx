import { useState, useEffect, useRef } from "react";
import { Notice } from "@/api/entities";

const BRAND = {
  accentViolet: "#5e50fb",
  lavenderWash: "#e8e6fe",
  softLilac: "#bab4fd",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
  textSecondary: "#5a5870",
  textMuted: "#9896ad",
  dark: "#1a1a1f",
};

const INSTRUCTION_TYPES = [
  "Build new feature",
  "Fix a bug",
  "Update UI",
  "Add data logic",
  "Ask a question",
];

export default function AICommandCentrePage() {
  const [instruction, setInstruction] = useState("");
  const [type, setType] = useState("Build new feature");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [recentInstructions, setRecentInstructions] = useState([]);
  const [codeCopied, setCodeCopied] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadRecent();
  }, []);

  async function loadRecent() {
    try {
      const items = await Notice.filter({ section: "code_ready" }, "-created_date", 5);
      setRecentInstructions(items || []);
    } catch (e) {}
  }

  async function sendToAITeam() {
    if (!instruction.trim()) return;
    setLoading(true);
    setResponse(null);
    setCodeCopied(false);
    setBriefCopied(false);

    try {
      const res = await fetch("/api/run/aiCommandCentre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: `[${type}] ${instruction}`, posted_by: "Kieran" }),
      });
      const data = await res.json();
      setResponse(data);
      loadRecent();
    } catch (e) {
      setResponse({ error: "Connection failed. Check function is deployed." });
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text, setter) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2500);
    });
  }

  function loadPastInstruction(item) {
    const content = item.content || "";
    const instructionLine = content.split("\n")[0].replace("INSTRUCTION:", "").trim();
    setInstruction(instructionLine);
    if (textareaRef.current) textareaRef.current.focus();
  }

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: BRAND.lavenderWash }}>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: "'Exo 2', 'Exo', sans-serif",
          fontSize: 22, fontWeight: 800,
          color: BRAND.accentViolet,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}>
          ⌘ AI Command Centre
        </div>
        <div style={{ color: BRAND.textMuted, fontSize: 13, marginTop: 4, fontFamily: "Montserrat, sans-serif" }}>
          Type your instruction — Simpee + Copilot respond — copy code to builder
        </div>
      </div>

      {/* 3 PANELS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        alignItems: "start",
      }}>

        {/* ── PANEL 1 — COMMAND ── */}
        <div style={{
          background: BRAND.white,
          borderRadius: 14,
          padding: 22,
          boxShadow: "0 2px 12px rgba(94,80,251,0.08)",
          border: `1.5px solid ${BRAND.neutralGrey}`,
        }}>
          <div style={{
            fontFamily: "'Exo 2', 'Exo', sans-serif",
            fontSize: 11, fontWeight: 700,
            color: BRAND.accentViolet,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 16,
          }}>
            Command
          </div>

          {/* Type selector */}
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: `1.5px solid ${BRAND.neutralGrey}`,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              color: BRAND.bodyText,
              background: BRAND.lavenderWash,
              marginBottom: 12,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {INSTRUCTION_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Instruction textarea */}
          <textarea
            ref={textareaRef}
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            placeholder="Type your instruction — what do you want to build or fix?"
            rows={7}
            onKeyDown={e => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendToAITeam();
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: `1.5px solid ${BRAND.neutralGrey}`,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              color: BRAND.bodyText,
              resize: "vertical",
              outline: "none",
              lineHeight: 1.6,
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = BRAND.accentViolet}
            onBlur={e => e.target.style.borderColor = BRAND.neutralGrey}
          />

          <button
            onClick={sendToAITeam}
            disabled={loading || !instruction.trim()}
            style={{
              width: "100%",
              padding: "12px",
              background: loading || !instruction.trim() ? BRAND.softLilac : BRAND.accentViolet,
              color: BRAND.white,
              border: "none",
              borderRadius: 9,
              fontFamily: "'Exo 2', 'Exo', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: loading || !instruction.trim() ? "not-allowed" : "pointer",
              marginTop: 12,
              transition: "all 0.15s",
            }}
          >
            {loading ? "Consulting AI Team..." : "Send to AI Team"}
          </button>

          <div style={{
            color: BRAND.textMuted,
            fontSize: 11,
            textAlign: "center",
            marginTop: 8,
            fontFamily: "Montserrat, sans-serif",
          }}>
            Simpee + Copilot will respond in the middle panel
          </div>
          <div style={{
            color: BRAND.textMuted,
            fontSize: 10,
            textAlign: "center",
            marginTop: 2,
          }}>
            Ctrl+Enter to send
          </div>

          {/* Recent instructions */}
          {recentInstructions.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: BRAND.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}>
                Recent
              </div>
              {recentInstructions.map(item => (
                <div
                  key={item.id}
                  onClick={() => loadPastInstruction(item)}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 7,
                    border: `1px solid ${BRAND.neutralGrey}`,
                    marginBottom: 5,
                    cursor: "pointer",
                    fontSize: 11,
                    color: BRAND.textSecondary,
                    fontFamily: "Montserrat, sans-serif",
                    background: BRAND.lavenderWash,
                    transition: "all 0.12s",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = BRAND.accentViolet}
                  onMouseLeave={e => e.currentTarget.style.borderColor = BRAND.neutralGrey}
                  title={item.title}
                >
                  {item.title?.replace("AI Command — ", "") || "Untitled"}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PANEL 2 — AI RESPONSE ── */}
        <div style={{
          background: BRAND.white,
          borderRadius: 14,
          padding: 22,
          boxShadow: "0 2px 12px rgba(94,80,251,0.08)",
          border: `1.5px solid ${BRAND.neutralGrey}`,
          minHeight: 420,
        }}>
          {/* Header with status dots */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <div style={{
              fontFamily: "'Exo 2', 'Exo', sans-serif",
              fontSize: 11, fontWeight: 700,
              color: BRAND.accentViolet,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}>
              Simpee + Copilot
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: loading ? "0 0 0 3px rgba(34,197,94,0.3)" : "none",
                  animation: loading ? "pulse 1.2s infinite" : "none",
                }} />
                <span style={{ fontSize: 10, color: BRAND.textMuted }}>Simpee</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#3b82f6",
                }} />
                <span style={{ fontSize: 10, color: BRAND.textMuted }}>Copilot</span>
              </div>
            </div>
          </div>

          {/* States */}
          {!loading && !response && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              minHeight: 300,
              color: BRAND.textMuted,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              gap: 10,
            }}>
              <div style={{ fontSize: 28, opacity: 0.4 }}>◈</div>
              <div>Waiting for your instruction...</div>
            </div>
          )}

          {loading && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              minHeight: 300,
              color: BRAND.accentViolet,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              gap: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: `3px solid ${BRAND.softLilac}`,
                borderTopColor: BRAND.accentViolet,
                animation: "spin 0.8s linear infinite",
              }} />
              <div>Consulting AI team...</div>
              <div style={{ fontSize: 11, color: BRAND.textMuted }}>Searching M365 + generating response</div>
            </div>
          )}

          {response && !response.error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Model badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: BRAND.lavenderWash,
                border: `1px solid ${BRAND.softLilac}`,
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 10,
                color: BRAND.accentViolet,
                fontWeight: 600,
                width: "fit-content",
              }}>
                {response.m365_grounded ? "M365 grounded · " : ""}
                {response.model || "Simpee"}
              </div>

              {/* Analysis */}
              {response.analysis && (
                <div style={{
                  background: BRAND.white,
                  border: `1.5px solid ${BRAND.neutralGrey}`,
                  borderRadius: 10,
                  padding: 14,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: BRAND.accentViolet,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 8,
                    fontFamily: "'Exo 2', sans-serif",
                  }}>Analysis</div>
                  <div style={{
                    fontSize: 13, color: BRAND.bodyText,
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}>
                    {response.analysis}
                  </div>
                </div>
              )}

              {/* Solution */}
              {response.solution && (
                <div style={{
                  background: BRAND.white,
                  border: `1.5px solid ${BRAND.neutralGrey}`,
                  borderRadius: 10,
                  padding: 14,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: BRAND.accentViolet,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 8,
                    fontFamily: "'Exo 2', sans-serif",
                  }}>Solution</div>
                  <div style={{
                    fontSize: 13, color: BRAND.bodyText,
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}>
                    {response.solution}
                  </div>
                </div>
              )}

              {/* Builder Instruction */}
              {response.builder_instruction && (
                <div style={{
                  background: "#fffbeb",
                  border: `1.5px solid #fcd34d`,
                  borderRadius: 10,
                  padding: 14,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: "#92400e",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 8,
                    fontFamily: "'Exo 2', sans-serif",
                  }}>Builder Instruction</div>
                  <div style={{
                    fontSize: 13, color: "#78350f",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}>
                    {response.builder_instruction}
                  </div>
                </div>
              )}
            </div>
          )}

          {response?.error && (
            <div style={{
              background: "#fef2f2",
              border: "1.5px solid #fca5a5",
              borderRadius: 10, padding: 14,
              color: "#dc2626",
              fontSize: 13,
              fontFamily: "Montserrat, sans-serif",
            }}>
              {response.error}
            </div>
          )}
        </div>

        {/* ── PANEL 3 — BUILDER ── */}
        <div style={{
          background: BRAND.white,
          borderRadius: 14,
          padding: 22,
          boxShadow: "0 2px 12px rgba(94,80,251,0.08)",
          border: `1.5px solid ${BRAND.neutralGrey}`,
          minHeight: 420,
        }}>
          <div style={{
            fontFamily: "'Exo 2', 'Exo', sans-serif",
            fontSize: 11, fontWeight: 700,
            color: BRAND.accentViolet,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 16,
          }}>
            Builder
          </div>

          {!response && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              minHeight: 300,
              color: BRAND.textMuted,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 13,
              gap: 10,
            }}>
              <div style={{ fontSize: 28, opacity: 0.4 }}>{ }</div>
              <div>Code will appear here</div>
              <div style={{ fontSize: 11, textAlign: "center", maxWidth: 180 }}>
                Send an instruction to generate ready-to-paste code
              </div>
            </div>
          )}

          {response && !response.error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Code block */}
              {response.code && (
                <div>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: BRAND.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>Code</div>
                    <button
                      onClick={() => copyToClipboard(response.code, setCodeCopied)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 7,
                        border: "none",
                        background: codeCopied ? "#22c55e" : BRAND.accentViolet,
                        color: BRAND.white,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                        transition: "background 0.2s",
                      }}
                    >
                      {codeCopied ? "Copied ✓" : "Copy Code"}
                    </button>
                  </div>
                  <div style={{
                    background: BRAND.dark,
                    borderRadius: 9,
                    padding: 14,
                    maxHeight: 260,
                    overflowY: "auto",
                  }}>
                    <pre style={{
                      margin: 0,
                      fontSize: 11,
                      color: "#e2e8f0",
                      fontFamily: "'Fira Code', 'Courier New', monospace",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}>
                      {response.code}
                    </pre>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${BRAND.neutralGrey}` }} />

              {/* Builder instruction block */}
              {response.builder_instruction && (
                <div>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: "#92400e",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>Paste into Builder Chat</div>
                    <button
                      onClick={() => copyToClipboard(response.builder_instruction, setBriefCopied)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 7,
                        border: "none",
                        background: briefCopied ? "#22c55e" : "#f59e0b",
                        color: BRAND.white,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                        transition: "background 0.2s",
                      }}
                    >
                      {briefCopied ? "Copied ✓" : "Copy Brief"}
                    </button>
                  </div>
                  <div style={{
                    background: "#fffbeb",
                    border: `1px solid #fcd34d`,
                    borderRadius: 9,
                    padding: 14,
                    fontSize: 12,
                    color: "#78350f",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    userSelect: "all",
                  }}>
                    {response.builder_instruction}
                  </div>
                </div>
              )}

              {/* Model used */}
              <div style={{
                fontSize: 10,
                color: BRAND.textMuted,
                textAlign: "center",
                fontFamily: "Montserrat, sans-serif",
              }}>
                Generated by: {response.model || "Simpee"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
      `}</style>
    </div>
  );
}
