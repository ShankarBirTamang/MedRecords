import React from "react";

const STYLES = {
  pending: "badge-pending",
  approved: "badge-approved",
  rejected: "badge-rejected",
  revoked: "badge-revoked",
};

export default function StatusBadge({ status }) {
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span className={STYLES[status] || "badge badge-revoked"}>
      {label}
    </span>
  );
}