import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import RequestCard from "../../components/RequestCard";

export default function DoctorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/access/mine");
      setRequests(data.requests || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const approved = requests.filter(
    (r) => r.requestStatus === "approved"
  );

  const pending = requests.filter(
    (r) => r.requestStatus === "pending"
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>

          <p className="text-xs uppercase tracking-widest text-[var(--button-primary)] font-bold mb-2">
            Doctor Portal
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Doctor Dashboard
          </h1>

          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Manage patient access and review authorized medical records.
          </p>

        </div>

        {/* REQUEST ACCESS */}
        <Link
          to="/doctor/request"
          className="btn-primary text-center"
        >
          Request Patient Access
        </Link>

      </div>


      {/* ERROR */}
      {error && (

        <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40 p-5 mb-6">

          <p className="text-red-700 dark:text-red-300 text-sm">
            {error}
          </p>

        </div>

      )}


      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

        <div className="card">

          <p className="text-sm text-[var(--text-secondary)]">
            Total Requests
          </p>

          <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            {loading ? "..." : requests.length}
          </p>

        </div>


        <div className="card">

          <p className="text-sm text-[var(--text-secondary)]">
            Approved Patients
          </p>

          <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            {loading ? "..." : approved.length}
          </p>

        </div>


        <div className="card">

          <p className="text-sm text-[var(--text-secondary)]">
            Pending Requests
          </p>

          <p className="text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            {loading ? "..." : pending.length}
          </p>

        </div>

      </div>


      {/* LOADING */}
      {loading && (

        <div className="card p-10 text-center mb-8">

          <p className="text-[var(--text-secondary)]">
            Loading dashboard...
          </p>

        </div>

      )}


      {/* APPROVED PATIENTS */}
      {!loading && approved.length > 0 && (

        <div className="mb-10">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                My Patients
              </h2>

              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Patients who have granted you access to their medical records.
              </p>

            </div>

            <span className="text-sm text-[var(--text-secondary)]">
              {approved.length} patient
              {approved.length !== 1 ? "s" : ""}
            </span>

          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {approved.map((request) => (

              <Link
                key={request._id}
                to={`/doctor/records/${request.patientId._id}`}
                className="group card hover:border-[var(--button-primary)] transition"
              >

                {/* PATIENT HEADER */}
                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-[var(--button-primary)] flex items-center justify-center text-lg font-bold text-white">
                    {request.patientId.name?.charAt(0).toUpperCase() || "P"}
                  </div>

                  <div className="min-w-0">

                    <p className="font-bold text-lg text-[var(--text-primary)] truncate">
                      {request.patientId.name}
                    </p>

                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {request.patientId.email}
                    </p>

                  </div>

                </div>


                {/* ACCESS STATUS */}
                <div className="mt-5 flex items-center gap-2">

                  <span className="flex h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs text-green-600 dark:text-green-400">
                    Access authorized
                  </span>

                </div>


                {/* ACTION */}
                <div
                  className="mt-5 pt-4 flex items-center justify-between"
                  style={{
                    borderTop: "1px solid var(--border-color)",
                  }}
                >

                  <span className="text-xs text-[var(--text-secondary)]">
                    Medical records
                  </span>

                  <span className="text-sm text-[var(--button-primary)] group-hover:translate-x-1 transition-transform">
                    View Records →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        </div>

      )}


      {/* NO REQUESTS */}
      {!loading && requests.length === 0 && (

        <div className="card text-center py-16 mb-8">

          <div className="text-5xl mb-5">
            👨‍⚕️
          </div>

          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            No patient requests yet
          </h3>

          <p className="text-[var(--text-secondary)] text-sm mt-2 mb-6">
            Request access to a patient's medical records to begin.
          </p>

          <Link
            to="/doctor/request"
            className="btn-primary"
          >
            Request Patient Access
          </Link>

        </div>

      )}


      {/* ACCESS REQUESTS */}
      {!loading && requests.length > 0 && (

        <section>

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Access Requests
              </h2>

              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Track the status of your patient access requests.
              </p>

            </div>

            <span className="text-sm text-[var(--text-secondary)]">
              {requests.length} request
              {requests.length !== 1 ? "s" : ""}
            </span>

          </div>


          <div className="space-y-3">

            {requests.map((request) => (

              <div
                key={request._id}
                className="card p-1 hover:border-[var(--button-primary)] transition"
              >

                <RequestCard
                  request={request}
                  person={request.patientId}
                  personLabel="Patient"
                />

              </div>

            ))}

          </div>

        </section>

      )}

    </div>
  );
}