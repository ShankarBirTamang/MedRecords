import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { getContract } from "../../services/web3";
import RequestCard from "../../components/RequestCard";

export default function AccessRequests() {
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [busyId, setBusyId] = useState(null);

async function load() {
setLoading(true);
setError("");

   
try {
  const { data } = await api.get("/access/incoming");
  setRequests(data.requests);
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

async function handleDecision(request, decision) {
setBusyId(request._id);
setError("");

   
try {
  const contract = await getContract();

  let tx;

  if (decision === "grant") {
    tx = await contract.grantAccess(
      request.chainRequestId
    );
  } else if (decision === "reject") {
    tx = await contract.rejectAccess(
      request.chainRequestId
    );
  } else if (decision === "revoke") {
    tx = await contract.revokeAccess(
      request.doctorId.walletAddress
    );
  }

  const receipt = await tx.wait();

  await api.put(
    `/access/${
      request._id
    }/${decision === "grant" ? "grant" : decision}`,
    {
      chainTxHash: receipt.hash,
    }
  );

  load();
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.reason ||
      err.message ||
      "Action failed"
  );
} finally {
  setBusyId(null);
}
   

}

return ( <div className="max-w-3xl mx-auto">

   
  {/* HEADER */}
  <div className="mb-6">

    <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
      Access Requests
    </h1>

    <p className="text-sm text-[var(--text-secondary)]">
      Approve or reject doctors who request access to your
      records. You can revoke access at any time.
    </p>

  </div>


  {/* LOADING */}
  {loading && (
    <div className="card text-center py-10">

      <p className="animate-pulse text-[var(--text-secondary)] text-sm">
        Loading access requests...
      </p>

    </div>
  )}


  {/* ERROR */}
  {error && (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-4">

      <p className="text-sm text-red-700">
        {error}
      </p>

    </div>
  )}


  {/* EMPTY STATE */}
  {!loading && requests.length === 0 && (

    <div className="card text-center py-12">

      <div className="text-4xl mb-4">
        🔐
      </div>

      <p className="text-[var(--text-secondary)]">
        No access requests yet.
      </p>

    </div>

  )}


  {/* REQUESTS */}
  {!loading && requests.length > 0 && (

    <div className="space-y-3">

      {requests.map((r) => (

        <RequestCard
          key={r._id}
          request={r}
          person={r.doctorId}
          personLabel="Doctor"
          busy={busyId === r._id}
          actions={

            r.requestStatus === "pending" ? (

              <>

                <button
                  className="btn-primary"
                  disabled={busyId === r._id}
                  onClick={() =>
                    handleDecision(r, "grant")
                  }
                >
                  Approve
                </button>

                <button
                  className="btn-outline"
                  disabled={busyId === r._id}
                  onClick={() =>
                    handleDecision(r, "reject")
                  }
                >
                  Reject
                </button>

              </>

            ) : r.requestStatus === "approved" ? (

              <button
                className="btn-danger"
                disabled={busyId === r._id}
                onClick={() =>
                  handleDecision(r, "revoke")
                }
              >
                Revoke
              </button>

            ) : null

          }
        />

      ))}

    </div>

  )}

</div>
   

);
}
