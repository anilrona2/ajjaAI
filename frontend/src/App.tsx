import { useState } from "react";
import ExtractTab from "./components/ExtractTab";
import GapAnalysisTab from "./components/GapAnalysisTab";
import DocumentsTab from "./components/DocumentsTab";
import SettingsTab from "./components/SettingsTab";
import { DS160Fields } from "./types";

type Tab = "extract" | "gaps" | "documents" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("extract");
  const [fields, setFields] = useState<DS160Fields | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "extract", label: "Extract" },
    { id: "gaps", label: "Gap Analysis" },
    { id: "documents", label: "My Documents" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>ajjaAI</h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
          DS-160 Visa Application Assistant
        </p>
      </header>

      <nav style={{ display: "flex", gap: 4, borderBottom: "2px solid #e5e7eb", marginBottom: 24 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === t.id ? "2px solid #2563eb" : "2px solid transparent",
              borderRadius: 0,
              padding: "8px 16px",
              marginBottom: -2,
              color: activeTab === t.id ? "#2563eb" : "#6b7280",
              fontWeight: activeTab === t.id ? 600 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {activeTab === "extract" && <ExtractTab fields={fields} setFields={setFields} />}
      {activeTab === "gaps" && <GapAnalysisTab fields={fields} />}
      {activeTab === "documents" && <DocumentsTab />}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}
