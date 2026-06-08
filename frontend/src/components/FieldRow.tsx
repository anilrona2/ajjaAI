import { FieldValue, Source } from "../types";

interface Props {
  label: string;
  fieldKey: string;
  field: FieldValue;
  onChange: (v: string) => void;
}

const sourceLabel: Record<NonNullable<Source>, string> = {
  passport: "from passport",
  visa_stamp: "from visa stamp",
  i797: "from I-797",
};

export default function FieldRow({ label, fieldKey, field, onChange }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: 8,
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {field.source && (
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            {sourceLabel[field.source]}
          </div>
        )}
      </div>
      <input
        id={fieldKey}
        value={field.value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        style={{
          padding: "6px 10px",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          fontSize: 13,
          width: "100%",
          background: field.found ? "#f0fdf4" : "#fffbeb",
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 12,
          background: field.found ? "#dcfce7" : "#fef9c3",
          color: field.found ? "#166534" : "#854d0e",
          whiteSpace: "nowrap",
        }}
      >
        {field.found ? "Found" : "Missing"}
      </span>
    </div>
  );
}
