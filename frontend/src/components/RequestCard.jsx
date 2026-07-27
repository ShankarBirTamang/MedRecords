import React from "react";
import StatusBadge from "./StatusBadge";

export default function RequestCard({
  request,
  personLabel,
  person,
  actions,
  busy,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">

      {/* PERSON INFORMATION */}
      <div className="flex items-center gap-3 min-w-0">

        {/* AVATAR */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--button-primary)] text-white flex items-center justify-center text-sm font-bold">
          {person?.name?.charAt(0).toUpperCase() || "?"}
        </div>


        {/* DETAILS */}
        <div className="min-w-0">

          <p className="font-semibold text-[var(--text-primary)] truncate">
            {person?.name || "Unknown"}
          </p>

          <p className="text-xs text-[var(--text-secondary)] truncate">
            {person?.email || "No email available"}
          </p>

          <p className="text-xs text-[var(--text-secondary)] font-mono truncate mt-1">
            {person?.walletAddress || "No wallet address"}
          </p>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {personLabel} · requested{" "}
            {new Date(request.createdAt).toLocaleString()}
          </p>

        </div>

      </div>


      {/* STATUS AND ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">

        <StatusBadge status={request.requestStatus} />

        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}

      </div>

    </div>
  );
}