import { DS160Fields, FIELD_META } from "../types";

interface Props {
  fields: DS160Fields | null;
}

export default function GapAnalysisTab({ fields }: Props) {
  if (!fields) {
    return (
      <p style={{ color: "#6b7280", fontSize: 14 }}>
        Run an extraction on the Extract tab first.
      </p>
    );
  }

  const missing = FIELD_META.filter((m) => !fields[m.key].found);

  if (!missing.length) {
    return (
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 8,
          padding: 20,
          color: "#166534",
          fontSize: 15,
        }}
      >
        All 50 fields were found in your documents.
      </div>
    );
  }

  const grouped = missing.reduce<Record<string, typeof missing>>((acc, m) => {
    (acc[m.section] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
        {missing.length} field{missing.length !== 1 ? "s" : ""} could not be extracted from your documents. Fill these in manually on the DS-160 or in the Extract tab.
      </p>
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: "6px 12px",
              background: "#fff7ed",
              borderRadius: 6,
              marginBottom: 4,
              color: "#9a3412",
            }}
          >
            {section}
          </h2>
          {items.map(({ key, label, hint }) => (
            <div
              key={key}
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                {hint}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
