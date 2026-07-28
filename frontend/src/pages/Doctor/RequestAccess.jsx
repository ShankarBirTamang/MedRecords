import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAddress } from "ethers";
import api from "../../services/api";
import { getContract } from "../../services/web3";

export default function RequestAccess() {
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");
  const [patient, setPatient] = useState(null);

  const [step, setStep] = useState("");
  const [error, setError] = useState("");

  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFindPatient(e) {
    e.preventDefault();

    setError("");
    setPatient(null);

    if (!isAddress(walletAddress)) {
      return setError("Enter a valid wallet address");
    }

    setSearching(true);

    try {
      const { data } = await api.get(
        `/access/patient/${walletAddress}`
      );

      setPatient(data.patient);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Patient not found"
      );
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!patient) {
    return setError("Find a patient before requesting access");
  }

  setError("");
  setBusy(true);

  try {
    setStep("Confirm in MetaMask to send the on-chain request...");

    const contract = await getContract();

    console.log("Patient wallet:", patient.walletAddress);
    console.log("Contract address:", contract.target);

    const tx = await contract.requestAccess(patient.walletAddress);

    setStep("Waiting for blockchain confirmation...");

    const receipt = await tx.wait();

    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed) => parsed?.name === "AccessRequested");

    if (!event) {
      throw new Error(
        "Blockchain transaction succeeded, but AccessRequested event was not found."
      );
    }

    const chainRequestId = event.args.requestId.toString();

    setStep("Notifying patient...");

    await api.post("/access/request", {
      patientWalletAddress: patient.walletAddress,
      chainRequestId,
      chainTxHash: receipt.hash,
    });

    navigate("/doctor");

  } catch (err) {
    console.error("Request access error:", err);

    setError(
      err.response?.data?.message ||
      err.reason ||
      err.shortMessage ||
      err.message ||
      "Request failed"
    );
  } finally {
    setBusy(false);
    setStep("");
  }
}

  return (
    <div className="max-w-lg mx-auto px-6 py-8">

      <h1 className="text-xl font-semibold text-ink mb-1">
        Request Patient Access
      </h1>

      <p className="text-sm text-muted mb-6">
        Find a patient using their wallet address before
        requesting access to their medical records.
      </p>

      {/* Patient Search */}
      <form
        onSubmit={handleFindPatient}
        className="card space-y-5"
      >

        <div>
          <label className="label">
            Patient wallet address
          </label>

          <input
            className="input font-mono"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
              setPatient(null);
            }}
          />
        </div>

        <button
          className="btn-primary w-full"
          type="submit"
          disabled={searching || busy}
        >
          {searching
            ? "Searching..."
            : "Find Patient"}
        </button>

      </form>

      {/* Patient Information */}
      {patient && (
        <div className="card mt-5">

          <h2 className="font-semibold text-ink mb-3">
            Patient Found
          </h2>

          <div className="space-y-2 text-sm">

            <p>
              <span className="text-muted">
                Name:
              </span>{" "}
              {patient.name}
            </p>

            <p>
              <span className="text-muted">
                Email:
              </span>{" "}
              {patient.email}
            </p>

            <p className="break-all">
              <span className="text-muted">
                Wallet:
              </span>{" "}
              <span className="font-mono text-xs">
                {patient.walletAddress}
              </span>
            </p>

          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary w-full mt-5"
            disabled={busy}
          >
            {busy
              ? "Processing..."
              : "Request Access"}
          </button>

        </div>
      )}

      {/* Blockchain Status */}
      {step && (
        <p className="text-sm text-primary mt-4">
          {step}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-danger mt-4">
          {error}
        </p>
      )}

    </div>
  );
}