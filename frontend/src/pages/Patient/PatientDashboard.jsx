import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import RecordCard from "../../components/RecordCard";

export default function PatientDashboard() {
const [records, setRecords] = useState([]);
const [notes, setNotes] = useState([]);

const [loading, setLoading] = useState(true);
const [notesLoading, setNotesLoading] = useState(true);

const [error, setError] = useState("");
const [notesError, setNotesError] = useState("");

async function load() {
setLoading(true);
setError("");

   
try {
  const { data } = await api.get("/records/mine");
  setRecords(data.records || []);
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Failed to load records"
  );
} finally {
  setLoading(false);
}
   

}

async function loadNotes() {
setNotesLoading(true);
setNotesError("");

   
try {
  const { data } = await api.get("/doctor-notes/mine");
  setNotes(data.notes || []);
} catch (err) {
  setNotesError(
    err.response?.data?.message ||
      "Failed to load doctor notes"
  );
} finally {
  setNotesLoading(false);
}
   

}

useEffect(() => {
load();
loadNotes();
}, []);

async function handleDownload(record) {
try {
const res = await api.get(
`/records/${record._id}/download`,
{
responseType: "blob",
}
);

   
  const url = window.URL.createObjectURL(
    new Blob([res.data])
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = record.fileName;
  a.click();

  window.URL.revokeObjectURL(url);
} catch (err) {
  alert(
    err.response?.data?.message ||
      "Failed to download record"
  );
}
   

}

async function handleDelete(record) {
if (
!window.confirm(
`Delete "${record.fileName}"? This cannot be undone.`
)
) {
return;
}

   
try {
  await api.delete(`/records/${record._id}`);
  load();
} catch (err) {
  alert(
    err.response?.data?.message ||
      "Failed to delete record"
  );
}
   

}

return ( <div>

   
  {/* HEADER */}
  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">

    <div>

      <p className="text-xs uppercase tracking-widest text-[var(--button-primary)] font-bold mb-3">
        Patient Dashboard
      </p>

      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
        Welcome back
      </h1>

      <p className="text-[var(--text-secondary)] mt-3">
        Your medical records are secure, private, and under your control.
      </p>

    </div>

    {/* ACTION BUTTONS */}
    <div className="flex flex-wrap gap-3">

      <Link
        to="/patient/requests"
        className="btn-outline"
      >
        Access Requests
      </Link>

      <Link
        to="/patient/notes"
        className="btn-outline"
      >
        Doctor Notes
      </Link>

      <Link
        to="/patient/upload"
        className="btn-primary"
      >
        + Upload Record
      </Link>

    </div>

  </div>


  {/* STAT CARDS */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

    <div className="card">

      <p className="text-sm text-[var(--text-secondary)]">
        Total Records
      </p>

      <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">
        {records.length}
      </p>

      <p className="text-xs text-success mt-2">
        Stored securely
      </p>

    </div>


    <div className="card">

      <p className="text-sm text-[var(--text-secondary)]">
        Doctor Notes
      </p>

      <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">
        {notes.length}
      </p>

      <p className="text-xs text-success mt-2">
        From your doctors
      </p>

    </div>


    <div className="card">

      <p className="text-sm text-[var(--text-secondary)]">
        Ownership
      </p>

      <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">
        You
      </p>

      <p className="text-xs text-success mt-2">
        You control access
      </p>

    </div>

  </div>


  {/* MEDICAL RECORDS */}
  <section className="mb-12">

    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
          Your Medical Records
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Hash-verified records stored securely in your account.
        </p>

      </div>

      <span className="text-sm text-[var(--text-secondary)]">
        {records.length} record
        {records.length !== 1 ? "s" : ""}
      </span>

    </div>


    {/* LOADING */}
    {loading && (

      <div className="card text-center py-10">

        <div className="animate-pulse text-[var(--text-secondary)]">
          Loading your medical records...
        </div>

      </div>

    )}


    {/* ERROR */}
    {error && (

      <div
      className="rounded-lg border p-5 text-sm"
      style={{
        color: "var(--danger-color)",
        borderColor: "var(--danger-color)",
        backgroundColor: "color-mix(in srgb, var(--danger-color) 10%, transparent)",
      }}
    >
      {error}
    </div>

    )}


    {/* EMPTY STATE */}
    {!loading && records.length === 0 && (

      <div className="card text-center py-16">

        <div className="text-5xl mb-5">
          📄
        </div>

        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          No Medical Records Yet
        </h3>

        <p className="text-[var(--text-secondary)] text-sm mt-2 mb-6">
          Upload your first medical record to begin building your secure health history.
        </p>

        <Link
          to="/patient/upload"
          className="btn-primary"
        >
          Upload Your First Record
        </Link>

      </div>

    )}


    {/* RECORDS */}
    {!loading && records.length > 0 && (

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {records.map((record) => (

          <RecordCard
            key={record._id}
            record={record}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />

        ))}

      </div>

    )}

  </section>


  {/* DOCTOR NOTES */}
  <section>

    <div className="flex items-center justify-between mb-5">

      <div>

        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
          Doctor Notes
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Recommendations, prescriptions, and instructions from your doctors.
        </p>

      </div>

      <span className="text-sm text-[var(--text-secondary)]">
        {notes.length} note
        {notes.length !== 1 ? "s" : ""}
      </span>

    </div>


    {/* NOTES LOADING */}
    {notesLoading && (

      <div className="card text-center py-10">

        <div className="animate-pulse text-[var(--text-secondary)]">
          Loading doctor notes...
        </div>

      </div>

    )}


    {/* NOTES ERROR */}
    {notesError && (

      <div
        className="rounded-lg border p-5 text-sm"
        style={{
          color: "var(--danger-color)",
          borderColor: "var(--danger-color)",
          backgroundColor: "color-mix(in srgb, var(--danger-color) 10%, transparent)",
        }}
      >
        {notesError}
      </div>

    )}


    {/* NO NOTES */}
    {!notesLoading &&
      !notesError &&
      notes.length === 0 && (

        <div className="card text-center py-12">

          <div className="text-5xl mb-5">
            🩺
          </div>

          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            No Doctor Notes Yet
          </h3>

          <p className="text-[var(--text-secondary)] text-sm mt-2">
            Notes and recommendations from your doctors will appear here.
          </p>

        </div>

      )}


    {/* NOTES */}
    {!notesLoading &&
      !notesError &&
      notes.length > 0 && (

        <div className="space-y-4">

          {notes.map((note) => (

            <div
              key={note._id}
              className="card"
            >

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                <div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {note.title}
                  </h3>

                  <p className="text-sm text-[var(--button-primary)] mt-1">
                    Dr.{" "}
                    {note.doctorId?.name || "Doctor"}
                  </p>

                  {note.doctorId?.email && (

                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {note.doctorId.email}
                    </p>

                  )}

                </div>

                <p className="text-xs text-[var(--text-secondary)]">
                  {new Date(
                    note.createdAt
                  ).toLocaleString()}
                </p>

              </div>


              <div
                className="mt-5 pt-4"
                style={{
                  borderTop: "1px solid var(--border-color)",
                }}
              >

                <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

  </section>

</div>
   

);
}
