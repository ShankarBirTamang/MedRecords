import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import RecordCard from "../../components/RecordCard";

export default function ViewRecords() {
const { patientId } = useParams();

const [records, setRecords] = useState([]);
const [patient, setPatient] = useState(null);
const [notes, setNotes] = useState([]);

const [loading, setLoading] = useState(true);
const [notesLoading, setNotesLoading] = useState(true);

const [error, setError] = useState("");
const [notesError, setNotesError] = useState("");

const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [savingNote, setSavingNote] = useState(false);

useEffect(() => {
async function loadPatientData() {
setLoading(true);
setNotesLoading(true);
setError("");
setNotesError("");

   
  try {
    const recordsResponse = await api.get(
      `/records/patient/${patientId}`
    );

    setRecords(recordsResponse.data.records || []);
    setPatient(recordsResponse.data.patient);

    try {
      const notesResponse = await api.get(
        `/doctor-notes/patient/${patientId}`
      );

      setNotes(notesResponse.data.notes || []);
    } catch (err) {
      setNotesError(
        err.response?.data?.message ||
          "Failed to load doctor notes"
      );
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to load patient records"
    );
  } finally {
    setLoading(false);
    setNotesLoading(false);
  }
}

loadPatientData();
   

}, [patientId]);

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

async function handleCreateNote(e) {
e.preventDefault();

   
if (!title.trim() || !content.trim()) {
  alert("Please enter both a title and note content.");
  return;
}

setSavingNote(true);

try {
  const { data } = await api.post(
    `/doctor-notes/${patientId}`,
    {
      title,
      content,
    }
  );

  setNotes((previousNotes) => [
    data.note,
    ...previousNotes,
  ]);

  setTitle("");
  setContent("");

  alert("Doctor note added successfully.");
} catch (err) {
  alert(
    err.response?.data?.message ||
      "Failed to create doctor note"
  );
} finally {
  setSavingNote(false);
}
   

}

const latestRecord =
records.length > 0 ? records[0] : null;

const recordTypes = [
...new Set(
records.map((record) => record.recordType)
),
];

return ( <div className="max-w-6xl mx-auto px-6 py-8">

   
  {/* BACK */}
  <Link
    to="/doctor"
    className="text-sm text-primary hover:underline"
  >
    &larr; Back to dashboard
  </Link>

  {/* PATIENT HEADER */}
  <div className="card mt-5 mb-6">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

      <div>

        <p className="text-xs uppercase tracking-wide text-muted mb-2">
          Patient Medical Profile
        </p>

        <h1 className="text-2xl font-semibold text-ink">
          {patient?.name || "Patient records"}
        </h1>

        {patient && (
          <>
            <p className="text-sm text-muted mt-1">
              {patient.email}
            </p>

            <p className="text-xs text-muted font-mono mt-2 break-all">
              Wallet: {patient.walletAddress}
            </p>
          </>
        )}

      </div>

      <div className="text-left md:text-right">

        <span className="badge-approved">
          Access Approved
        </span>

        <p className="text-xs text-muted mt-2">
          You are authorized to review this patient's records.
        </p>

      </div>

    </div>

  </div>

  {/* RECORD LOADING */}
  {loading && (
    <div className="card text-center py-12">
      <p className="text-muted text-sm">
        Loading patient records...
      </p>
    </div>
  )}

  {/* RECORD ERROR */}
  {error && (
    <div className="card mb-6">
      <p className="text-danger text-sm">
        {error}
      </p>
    </div>
  )}

  {!loading && !error && (
    <>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="card">
          <p className="text-sm text-muted">
            Total Records
          </p>

          <p className="text-3xl font-semibold text-ink mt-2">
            {records.length}
          </p>

          <p className="text-xs text-muted mt-1">
            Available for review
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-muted">
            Record Types
          </p>

          <p className="text-3xl font-semibold text-ink mt-2">
            {recordTypes.length}
          </p>

          <p className="text-xs text-muted mt-1">
            Different categories
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-muted">
            Latest Upload
          </p>

          <p className="text-lg font-semibold text-ink mt-3">
            {latestRecord
              ? new Date(
                  latestRecord.uploadDate
                ).toLocaleDateString()
              : "No records"}
          </p>

          <p className="text-xs text-muted mt-1">
            Most recent medical record
          </p>
        </div>

      </div>

      {/* MEDICAL RECORDS */}
      {records.length === 0 && (
        <div className="card text-center py-16 mb-8">

          <div className="text-4xl mb-4">
            📄
          </div>

          <h2 className="text-lg font-semibold text-ink">
            No medical records available
          </h2>

          <p className="text-sm text-muted mt-2">
            This patient has not uploaded any medical records yet.
          </p>

        </div>
      )}

      {records.length > 0 && (
        <section className="mb-10">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-lg font-semibold text-ink">
                Medical Records
              </h2>

              <p className="text-sm text-muted mt-1">
                Hash-verified records uploaded by the patient.
              </p>
            </div>

            <span className="text-sm text-muted">
              {records.length} record
              {records.length !== 1 ? "s" : ""}
            </span>

          </div>

          <div className="space-y-3">

            {records.map((record) => (
              <RecordCard
                key={record._id}
                record={record}
                onDownload={handleDownload}
              />
            ))}

          </div>

        </section>
      )}

      {/* CREATE DOCTOR NOTE */}
      <section className="card mb-10">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-ink">
            Add Doctor Note
          </h2>

          <p className="text-sm text-muted mt-1">
            Write a prescription, recommendation, diagnosis,
            or follow-up instruction for this patient.
          </p>

        </div>

        <form
          onSubmit={handleCreateNote}
          className="space-y-4"
        >

          <div>

            <label className="block text-sm font-medium text-ink mb-1">
              Note Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Follow-up Recommendation"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-ink mb-1">
              Note Content
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your medical note or recommendation..."
              rows={5}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-y"
            />

          </div>

          <button
            type="submit"
            disabled={savingNote}
            className="btn-primary"
          >
            {savingNote
              ? "Saving Note..."
              : "Save Doctor Note"}
          </button>

        </form>

      </section>

      {/* PREVIOUS NOTES */}
      <section>

        <div className="flex items-center justify-between mb-4">

          <div>

            <h2 className="text-lg font-semibold text-ink">
              Doctor Notes
            </h2>

            <p className="text-sm text-muted mt-1">
              Previous notes and recommendations for this patient.
            </p>

          </div>

          <span className="text-sm text-muted">
            {notes.length} note
            {notes.length !== 1 ? "s" : ""}
          </span>

        </div>

        {notesLoading && (
          <div className="card text-center py-8">
            <p className="text-sm text-muted">
              Loading doctor notes...
            </p>
          </div>
        )}

        {notesError && (
          <div className="card">
            <p className="text-danger text-sm">
              {notesError}
            </p>
          </div>
        )}

        {!notesLoading &&
          !notesError &&
          notes.length === 0 && (
            <div className="card text-center py-10">
              <p className="text-muted text-sm">
                No doctor notes have been added yet.
              </p>
            </div>
          )}

        {!notesLoading &&
          !notesError &&
          notes.length > 0 && (
            <div className="space-y-4">

              {notes.map((note) => (
                <div
                  key={note._id}
                  className="card"
                >

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                    <div>

                      <h3 className="font-semibold text-ink">
                        {note.title}
                      </h3>

                      <p className="text-xs text-muted mt-1">
                        Written by{" "}
                        {note.doctorId?.name || "Doctor"}
                      </p>

                    </div>

                    <p className="text-xs text-muted">
                      {new Date(
                        note.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <p className="text-sm text-ink mt-4 whitespace-pre-wrap">
                    {note.content}
                  </p>

                </div>
              ))}

            </div>
          )}

      </section>

    </>
  )}

</div>
   

);
}
