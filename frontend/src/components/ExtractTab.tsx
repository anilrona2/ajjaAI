import { useRef, useState } from "react";
import { DS160Fields, FIELD_META, DocRecord } from "../types";
import FieldRow from "./FieldRow";
import { jsPDF } from "jspdf";

interface Props {
  fields: DS160Fields | null;
  setFields: (f: DS160Fields) => void;
}

function groupBy<T extends { section: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[item.section] ??= []).push(item);
    return acc;
  }, {});
}

export default function ExtractTab({ fields, setFields }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const apiKey = localStorage.getItem("claude_api_key") ?? "";

  function addFiles(newFiles: FileList | File[]) {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const toAdd = Array.from(newFiles).filter(
        (f) => !existing.has(f.name + f.size)
      );
      return [...prev, ...toAdd];
    });
  }

  async function handleExtract() {
    if (!apiKey) {
      setError("No API key set. Go to Settings and enter your Anthropic API key.");
      return;
    }
    if (!files.length) {
      setError("Please upload at least one document.");
      return;
    }
    setError(null);
    setLoading(true);

    const form = new FormData();
    files.forEach((f) => form.append("files", f));

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "x-claude-api-key": apiKey },
        body: form,
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(msg.detail ?? `HTTP ${res.status}`);
      }
      const data: DS160Fields = await res.json();
      setFields(data);

      // Save to My Documents
      const found = Object.values(data).filter((v) => v.found).length;
      const record: DocRecord = {
        filename: files.map((f) => f.name).join(", "),
        uploadDate: new Date().toISOString(),
        fileType: files.map((f) => f.type || "unknown").join(", "),
        totalFields: 50,
        foundFields: found,
      };
      const history: DocRecord[] = JSON.parse(
        localStorage.getItem("doc_history") ?? "[]"
      );
      history.unshift(record);
      localStorage.setItem("doc_history", JSON.stringify(history.slice(0, 20)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function updateField(key: keyof DS160Fields, value: string) {
    if (!fields) return;
    setFields({
      ...fields,
      [key]: { ...fields[key], value: value || null },
    });
  }

  function exportJson() {
    if (!fields) return;
    const blob = new Blob([JSON.stringify(fields, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ds160_data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    if (!fields) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("DS-160 Field Summary — ajjaAI", 14, 18);
    doc.setFontSize(9);
    let y = 28;
    const sections = groupBy(FIELD_META);
    for (const [section, items] of Object.entries(sections)) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(section, 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const { key, label } of items) {
        const val = fields[key].value ?? "(not found)";
        const line = `${label}: ${val}`;
        const lines = doc.splitTextToSize(line, 180);
        lines.forEach((l: string) => {
          if (y > 280) { doc.addPage(); y = 14; }
          doc.text(l, 18, y);
          y += 5;
        });
      }
      y += 4;
    }
    doc.save("ds160_summary.pdf");
  }

  const sections = groupBy(FIELD_META);

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#2563eb" : "#d1d5db"}`,
          borderRadius: 10,
          padding: "32px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#eff6ff" : "#fff",
          marginBottom: 16,
          transition: "all .15s",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Drag and drop passport, I-797, or visa stamp images here, or click to browse
        </p>
        <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 6 }}>
          JPEG, PNG, PDF, HEIC, WEBP — max 10 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.heic,.heif,.webp"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {files.map((f, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f3f4f6",
                borderRadius: 14,
                padding: "4px 10px",
                fontSize: 12,
                margin: "0 6px 6px 0",
              }}
            >
              {f.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFiles((prev) => prev.filter((_, idx) => idx !== i));
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: 14,
                  lineHeight: 1,
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          className="btn-primary"
          onClick={handleExtract}
          disabled={loading || !files.length}
        >
          {loading ? "Extracting…" : "Extract All"}
        </button>
        {fields && (
          <>
            <button className="btn-secondary" onClick={exportJson}>
              Export JSON
            </button>
            <button className="btn-secondary" onClick={exportPdf}>
              Export PDF
            </button>
          </>
        )}
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            padding: "12px 16px",
            color: "#dc2626",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {fields && (
        <div>
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} style={{ marginBottom: 24 }}>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "8px 12px",
                  background: "#f9fafb",
                  borderRadius: 6,
                  marginBottom: 4,
                }}
              >
                {section}
              </h2>
              {items.map(({ key, label }) => (
                <FieldRow
                  key={key}
                  fieldKey={key}
                  label={label}
                  field={fields[key]}
                  onChange={(v) => updateField(key, v)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
