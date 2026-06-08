import { useEffect, useState } from "react";
import { DocRecord } from "../types";

export default function DocumentsTab() {
  const [history, setHistory] = useState<DocRecord[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("doc_history");
    if (raw) setHistory(JSON.parse(raw));
  }, []);

  function clearHistory() {
    localStorage.removeItem("doc_history");
    setHistory([]);
  }

  if (!history.length) {
    return (
      <p style={{ color: "#6b7280", fontSize: 14 }}>
        No documents have been processed yet. Upload files on the Extract tab.
      </p>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Upload history is stored only in your browser — no files or PII are saved.
        </p>
        <button className="btn-danger" onClick={clearHistory} style={{ fontSize: 12 }}>
          Clear History
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f9fafb", textAlign: "left" }}>
            {["Files", "Date", "Type", "Fields Found"].map((h) => (
              <th key={h} style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.map((rec, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "10px 12px", maxWidth: 240, wordBreak: "break-word" }}>{rec.filename}</td>
              <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                {new Date(rec.uploadDate).toLocaleDateString()}
              </td>
              <td style={{ padding: "10px 12px" }}>{rec.fileType}</td>
              <td style={{ padding: "10px 12px" }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: rec.foundFields >= rec.totalFields * 0.8 ? "#166534" : "#854d0e",
                  }}
                >
                  {rec.foundFields}/{rec.totalFields}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
