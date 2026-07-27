import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function DoctorNotes() {
const [notes, setNotes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
async function loadNotes() {
try {
const { data } = await api.get("/doctor-notes/mine");
setNotes(data.notes || []);
} catch (err) {
setError(
err.response?.data?.message ||
"Failed to load doctor notes"
);
} finally {
setLoading(false);
}
}

   
loadNotes();
   

}, []);

return ( <div className="max-w-4xl mx-auto">

   
  {/* BACK */}
  <Link
    to="/patient"
    className="text-sm text-[var(--button-primary)] hover:underline"
  >
    &larr; Back to dashboard
  </Link>

  {/* HEADER */}
  <div className="mt-5 mb-8">

    <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-2">
      Medical Communication
    </p>

    <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
      Doctor Notes
    </h1>

    <p className="text-sm text-[var(--text-secondary)] mt-1">
      View prescriptions, recommendations, diagnoses, and
      follow-up instructions from your doctors.
    </p>

  </div>

  {/* LOADING */}
  {loading && (
    <div className="card text-center py-12">
      <p className="text-[var(--text-secondary)] text-sm">
        Loading doctor notes...
      </p>
    </div>
  )}

  {/* ERROR */}
  {error && (
    <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40 p-5">
      <p className="text-red-700 dark:text-red-300 text-sm">
        {error}
      </p>
    </div>
  )}

  {/* EMPTY STATE */}
  {!loading && !error && notes.length === 0 && (
    <div className="card text-center py-16">

      <div className="text-4xl mb-4">
        📝
      </div>

      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        No doctor notes yet
      </h2>

      <p className="text-sm text-[var(--text-secondary)] mt-2">
        Your doctors have not added any notes or recommendations yet.
      </p>

    </div>
  )}

  {/* NOTES */}
  {!loading && !error && notes.length > 0 && (
    <div className="space-y-4">

      {notes.map((note) => (

        <div
          key={note._id}
          className="card"
        >

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            <div>

              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {note.title}
              </h2>

              <p className="text-sm text-[var(--text-secondary)] mt-1">

                Written by{" "}

                <span className="font-medium text-[var(--text-primary)]">
                  {note.doctorId?.name || "Doctor"}
                </span>

              </p>

              {note.doctorId?.email && (

                <p className="text-xs text-[var(--text-secondary)]">
                  {note.doctorId.email}
                </p>

              )}

            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              {new Date(note.createdAt).toLocaleString()}
            </p>

          </div>

          <div
            className="mt-5 pt-4"
            style={{
              borderTop: "1px solid var(--border-color)",
            }}
          >

            <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
              {note.content}
            </p>

          </div>

        </div>

      ))}

    </div>
  )}

</div>
   

);
}
