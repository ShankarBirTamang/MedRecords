import React from "react";

const TYPE_ICON = {
  "PDF Report": "📄",
  Prescription: "💊",
  "Medical Image": "🩻",
  "Lab Report": "🧪",
  Other: "📁",
};

export default function RecordCard({
  record,
  onDownload,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      {/* RECORD INFORMATION */}
      <div className="flex items-center gap-3 min-w-0">

        <span className="text-2xl shrink-0">
          {TYPE_ICON[record.recordType] || "📁"}
        </span>

        <div className="min-w-0">

          <p className="font-medium text-ink truncate">
            {record.fileName}
          </p>

          <p className="text-xs text-muted">
            {record.recordType} ·{" "}
            {new Date(
              record.uploadDate
            ).toLocaleDateString()}
          </p>

          <p
            className="text-xs text-muted font-mono truncate"
            title={record.fileHash}
          >
            hash: {record.fileHash.slice(0, 18)}...
          </p>

        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2 shrink-0">

        <button
          className="btn-outline"
          onClick={() => onDownload(record)}
        >
          Download
        </button>

        {onDelete && (
          <button
            className="btn-ghost"
            style={{
              color: "var(--danger-color)",
            }}
            onClick={() => onDelete(record)}
          >
            Delete
          </button>
        )}

      </div>

    </div>
  );
}