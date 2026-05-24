import { X } from "lucide-react";

export default function EmailPreviewModal({ email, onClose }) {
  if (!email) return null;

  const bodyContent = email.body?.content || email.bodyPreview || "No content available";
  const isHtml = email.body?.contentType === "html";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        maxWidth: 700,
        width: "100%",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
      }}>
        {/* Header */}
        <div style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "18px 24px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1f2e", marginBottom: 8 }}>
              {email.subject}
            </h2>
            <div style={{ fontSize: 13, color: "#7b8db0" }}>
              From: <strong>{email.from?.emailAddress?.name || email.from?.emailAddress?.address}</strong>
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>
              {new Date(email.receivedDateTime).toLocaleString()}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#7b8db0",
              flexShrink: 0,
              marginTop: -4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px"
        }}>
          {isHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: bodyContent }}
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "#333"
              }}
            />
          ) : (
            <div style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "#333",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}>
              {bodyContent}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid #e5e7eb",
          padding: "12px 24px",
          display: "flex",
          gap: 8,
          justifyContent: "flex-end"
        }}>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              color: "#374151"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}