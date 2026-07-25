import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import RecordCard from "../../components/RecordCard";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
const { user, logout } = useAuth();

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
{ responseType: "blob" }
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

return ( <div className="min-h-screen bg-[#060F26] text-white">

   
  {/* NAVBAR */}
  <nav className="border-b border-white/10 bg-[#060F26]/80 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-3">

        <img
          src="/medrecords-logo.png"
          alt="MedRecords Logo"
          className="w-10 h-10 object-contain"
        />

        <span className="text-xl font-extrabold">
          MedRecords
        </span>

      </div>

        <div className="flex items-center gap-4">
          
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold">
            {user?.name || "Patient"}
          </p>

          <p className="text-xs text-white/40">
            Patient account
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
        >
          Logout
        </button>

      </div>

    </div>
  </nav>

  {/* MAIN CONTENT */}
  <main className="max-w-7xl mx-auto px-6 py-10">

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">

      <div>

        <p className="text-xs uppercase tracking-widest text-[#5EEAD4] font-bold mb-3">
          Patient dashboard
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-[#5EEAD4] to-[#5B8DEF] bg-clip-text text-transparent">
            {user?.name || "Patient"}
          </span>
        </h1>

        <p className="text-white/50 mt-3">
          Your medical records are secure, private, and under your control.
        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        <Link
          to="/patient/requests"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold hover:bg-white/[0.12] transition"
        >
          Access requests
        </Link>

        <Link
        to="/patient/notes"
        className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold hover:bg-white/[0.12] transition"
        >
          Doctor notes
        </Link>

        <Link
          to="/patient/upload"
          className="rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] px-5 py-3 text-sm font-bold text-[#04121A] hover:scale-[1.02] transition"
        >
          + Upload record
        </Link>

      </div>

    </div>

    {/* STAT CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">

        <p className="text-sm text-white/50">
          Total records
        </p>

        <p className="text-3xl font-extrabold mt-2">
          {records.length}
        </p>

        <p className="text-xs text-[#5EEAD4] mt-2">
          Stored securely
        </p>

      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">

        <p className="text-sm text-white/50">
          Doctor notes
        </p>

        <p className="text-3xl font-extrabold mt-2">
          {notes.length}
        </p>

        <p className="text-xs text-[#5EEAD4] mt-2">
          From your doctors
        </p>

      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">

        <p className="text-sm text-white/50">
          Ownership
        </p>

        <p className="text-3xl font-extrabold mt-2">
          You
        </p>

        <p className="text-xs text-[#5EEAD4] mt-2">
          You control access
        </p>

      </div>

    </div>

    {/* RECORD SECTION */}
    <section className="mb-12">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-2xl font-extrabold">
            Your medical records
          </h2>

          <p className="text-sm text-white/45 mt-1">
            Hash-verified records stored securely in your account.
          </p>

        </div>

        <span className="text-sm text-white/40">
          {records.length} record
          {records.length !== 1 ? "s" : ""}
        </span>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-10 text-center">

          <div className="animate-pulse text-white/50">
            Loading your medical records...
          </div>

        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && records.length === 0 && (

        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-16 text-center">

          <div className="text-5xl mb-5">
            📄
          </div>

          <h3 className="text-xl font-bold">
            No medical records yet
          </h3>

          <p className="text-white/45 text-sm mt-2 mb-6">
            Upload your first medical record to begin building your secure health history.
          </p>

          <Link
            to="/patient/upload"
            className="inline-flex rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] px-6 py-3 text-sm font-bold text-[#04121A]"
          >
            Upload your first record
          </Link>

        </div>

      )}

      {/* RECORDS */}
      {!loading && records.length > 0 && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {records.map((record) => (

            <div
              key={record._id}
              className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-2 hover:border-[#14B8A6]/40 transition"
            >

              <RecordCard
                record={record}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />

            </div>

          ))}

        </div>

      )}

    </section>

    {/* DOCTOR NOTES SECTION */}
    <section>

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-2xl font-extrabold">
            Doctor Notes
          </h2>

          <p className="text-sm text-white/45 mt-1">
            Recommendations, prescriptions, and instructions from your doctors.
          </p>

        </div>

        <span className="text-sm text-white/40">
          {notes.length} note
          {notes.length !== 1 ? "s" : ""}
        </span>

      </div>

      {/* NOTES LOADING */}
      {notesLoading && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-10 text-center">

          <div className="animate-pulse text-white/50">
            Loading doctor notes...
          </div>

        </div>
      )}

      {/* NOTES ERROR */}
      {notesError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-300">
          {notesError}
        </div>
      )}

      {/* NO NOTES */}
      {!notesLoading &&
        !notesError &&
        notes.length === 0 && (

          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-12 text-center">

            <div className="text-5xl mb-5">
              🩺
            </div>

            <h3 className="text-xl font-bold">
              No doctor notes yet
            </h3>

            <p className="text-white/45 text-sm mt-2">
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
                className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6"
              >

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                  <div>

                    <h3 className="text-lg font-bold">
                      {note.title}
                    </h3>

                    <p className="text-sm text-[#5EEAD4] mt-1">
                      Dr.{" "}
                      {note.doctorId?.name || "Doctor"}
                    </p>

                    {note.doctorId?.email && (
                      <p className="text-xs text-white/40 mt-1">
                        {note.doctorId.email}
                      </p>
                    )}

                  </div>

                  <p className="text-xs text-white/40">
                    {new Date(
                      note.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="mt-5 border-t border-white/10 pt-4">

                  <p className="text-sm text-white/75 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}
        

    </section>

  </main>

</div>
   

);
}