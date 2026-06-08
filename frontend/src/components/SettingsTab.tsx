import { useEffect, useState } from "react";

export default function SettingsTab() {
  const [apiKey, setApiKey] = useState("");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(localStorage.getItem("claude_api_key") ?? "");
  }, []);

  function save() {
    localStorage.setItem("claude_api_key", apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clear() {
    localStorage.removeItem("claude_api_key");
    setApiKey("");
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Anthropic API Key</h2>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
        Your key is stored only in this browser and sent directly to the FastAPI backend — never stored server-side.
        Get a key at <code>console.anthropic.com</code>.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type={show ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-api03-..."
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 13,
          }}
        />
        <button className="btn-secondary" onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-primary" onClick={save} disabled={!apiKey.trim()}>
          {saved ? "Saved!" : "Save Key"}
        </button>
        <button className="btn-danger" onClick={clear} disabled={!apiKey}>
          Clear
        </button>
      </div>

      {apiKey && (
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
          Key status: <span style={{ color: "#166534", fontWeight: 500 }}>set</span>
          {" "}({apiKey.slice(0, 14)}…)
        </p>
      )}
    </div>
  );
}
