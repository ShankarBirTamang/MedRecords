import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import RequestCard from "../../components/RequestCard";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDashboard() {
const { user, logout } = useAuth();

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
  setError(err.response?.data?.message || "Failed to load requests");
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

return ( <div className="min-h-screen bg-[#060F26] text-white">

   
  {/* NAVBAR */}
  <nav className="border-b border-white/10 bg-[#060F26]/80 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      {/* BRAND */}
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

      {/* DOCTOR INFO */}
      <div className="flex items-center gap-4">

        <div className="hidden sm:block text-right">

          <p className="text-sm font-semibold">
            {user?.name || "Doctor"}
          </p>

          <p className="text-xs text-white/40">
            Doctor account
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

      <div>

        <p className="text-xs uppercase tracking-widest text-[#5EEAD4] font-bold mb-2">
          Doctor Portal
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Doctor Dashboard
        </h1>

        <p className="text-sm text-white/50 mt-2">
          Manage patient access and review authorized medical records.
        </p>

      </div>

      <Link
        to="/doctor/request"
        className="rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] px-5 py-3 text-sm font-bold text-[#04121A] text-center hover:scale-[1.02] transition"
      >
        Request Patient Access
      </Link>

    </div>


    {/* ERROR */}
    {error && (

      <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 mb-6">

        <p className="text-red-300 text-sm">
          {error}
        </p>

      </div>

    )}


    {/* STATISTICS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">

        <p className="text-sm text-white/50">
          Total Requests
        </p>

        <p className="text-3xl font-extrabold mt-2">
          {loading ? "..." : requests.length}
        </p>

      </div>


      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">

        <p className="text-sm text-white/50">
          Approved Patients
        </p>

        <p className="text-3xl font-extrabold mt-2">
          {loading ? "..." : approved.length}
        </p>

      </div>


      <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">

        <p className="text-sm text-white/50">
          Pending Requests
        </p>

        <p className="text-3xl font-extrabold mt-2">
          {loading ? "..." : pending.length}
        </p>

      </div>

    </div>


    {/* LOADING */}
    {loading && (

      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-10 text-center mb-8">

        <p className="text-white/50">
          Loading dashboard...
        </p>

      </div>

    )}


{/* APPROVED PATIENTS */}
{!loading && approved.length > 0 && (

  <div className="mb-10">

    <div className="flex items-center justify-between mb-4">

      <div>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">
          My Patients
        </h2>

        <p className="text-sm text-white/40 mt-1">
          Patients who have granted you access to their medical records.
        </p>
      </div>

      <span className="text-sm text-white/40">
        {approved.length} patient{approved.length !== 1 ? "s" : ""}
      </span>

    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {approved.map((request) => (

        <Link
          key={request._id}
          to={`/doctor/records/${request.patientId._id}`}
          className="group rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5 hover:border-[#14B8A6]/50 hover:bg-white/[0.09] transition"
        >

          {/* PATIENT HEADER */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#5B8DEF] flex items-center justify-center text-lg font-bold text-[#04121A]">
              {request.patientId.name?.charAt(0).toUpperCase() || "P"}
            </div>

            <div className="min-w-0">

              <p className="font-bold text-lg truncate">
                {request.patientId.name}
              </p>

              <p className="text-xs text-white/45 truncate">
                {request.patientId.email}
              </p>

            </div>

          </div>


          {/* ACCESS STATUS */}
          <div className="mt-5 flex items-center gap-2">

            <span className="flex h-2 w-2 rounded-full bg-[#5EEAD4]" />

            <span className="text-xs text-[#5EEAD4]">
              Access authorized
            </span>

          </div>


          {/* ACTION */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">

            <span className="text-xs text-white/40">
              Medical records
            </span>

            <span className="text-sm text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
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

      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-16 text-center mb-8">

        <div className="text-5xl mb-5">
          👨‍⚕️
        </div>

        <h3 className="text-xl font-bold">
          No patient requests yet
        </h3>

        <p className="text-white/45 text-sm mt-2 mb-6">
          Request access to a patient's medical records to begin.
        </p>

        <Link
          to="/doctor/request"
          className="inline-flex rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] px-6 py-3 text-sm font-bold text-[#04121A]"
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
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">
          Access Requests
        </h2>

        <p className="text-sm text-white/40 mt-1">
          Track the status of your patient access requests.
        </p>
      </div>

      <span className="text-sm text-white/40">
        {requests.length} request{requests.length !== 1 ? "s" : ""}
      </span>

    </div>


    <div className="space-y-3">

      {requests.map((request) => (

        <div
          key={request._id}
          className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-1 hover:border-white/20 transition"
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

  </main>

</div>
   

);
}
