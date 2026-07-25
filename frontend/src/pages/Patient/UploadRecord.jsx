import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { getContract, hashFile } from "../../services/web3";

const TYPES = [
  "PDF Report",
  "Prescription",
  "Medical Image",
  "Lab Report",
  "Other",
];

export default function UploadRecord() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState("PDF Report");
  const [step, setStep] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      return setError("Choose a file first");
    }

    setError("");
    setBusy(true);

    try {
      setStep("Hashing file...");
      const fileHash = await hashFile(file);

      setStep("Confirm in MetaMask to write the hash on-chain...");
      const contract = await getContract();
      const tx = await contract.addRecord(fileHash, file.name);

      setStep("Waiting for blockchain confirmation...");
      const receipt = await tx.wait();

      let chainRecordId;

      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);

          if (parsed?.name === "RecordAdded") {
            chainRecordId = parsed.args.recordId.toString();
            break;
          }
        } catch (_) {
          // Ignore logs from other contracts
        }
      }

      setStep("Uploading file to secure storage...");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("recordType", recordType);

      if (chainRecordId) {
        formData.append("chainRecordId", chainRecordId);
      }

      formData.append("chainTxHash", receipt.hash);

      await api.post("/records", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/patient");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.reason ||
        err.message ||
        "Upload failed"
      );
    } finally {
      setBusy(false);
      setStep("");
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("File size must be less than 15MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  return (
    <div className="min-h-screen bg-[#060F26] text-white">

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

          <button
            onClick={() => navigate("/patient")}
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Back to dashboard
          </button>

        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-xs uppercase tracking-widest text-[#5EEAD4] font-bold mb-3">
            Secure medical records
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Upload a medical record
          </h1>

          <p className="text-white/50 mt-3 max-w-2xl">
            Add a new medical record to your personal health vault.
            The file hash will be recorded on the blockchain to verify
            its integrity and ownership.
          </p>

        </div>


        {/* UPLOAD CARD */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 md:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* RECORD TYPE */}

            <div>

              <label className="block text-sm font-semibold text-white/70 mb-2">
                Record type
              </label>

              <select
                className="w-full rounded-xl border border-white/10 bg-[#0A1B3D] px-4 py-3.5 text-white outline-none focus:border-[#14B8A6] transition"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                disabled={busy}
              >

                {TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}

              </select>

            </div>


            {/* FILE UPLOAD AREA */}

            <div>

              <label className="block text-sm font-semibold text-white/70 mb-2">
                Medical file
              </label>

              <label
                htmlFor="medical-file"
                className={`block cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
                  file
                    ? "border-[#14B8A6]/60 bg-[#14B8A6]/5"
                    : "border-white/15 bg-black/10 hover:border-[#14B8A6]/50 hover:bg-white/[0.04]"
                }`}
              >

                <input
                  id="medical-file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={busy}
                />

                {!file ? (

                  <>
                    <div className="text-5xl mb-4">
                      ↑
                    </div>

                    <p className="font-semibold text-lg">
                      Choose a medical file
                    </p>

                    <p className="text-sm text-white/40 mt-2">
                      Click here to browse your computer
                    </p>

                    <p className="text-xs text-white/30 mt-4">
                      PDF · JPG · PNG · DICOM · DOC · DOCX
                    </p>

                  </>

                ) : (

                  <>

                    <div className="text-4xl mb-4">
                      ✓
                    </div>

                    <p className="font-semibold text-[#5EEAD4]">
                      File selected
                    </p>

                    <p className="text-sm text-white/70 mt-2 break-all">
                      {file.name}
                    </p>

                    <p className="text-xs text-white/40 mt-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                  </>

                )}

              </label>

              <p className="text-xs text-white/35 mt-2">
                Maximum file size: 15MB
              </p>

            </div>


            {/* SECURITY INFORMATION */}

            <div className="grid md:grid-cols-3 gap-3">

              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-lg mb-2">
                  🔐
                </p>

                <p className="text-sm font-semibold">
                  Secure storage
                </p>

                <p className="text-xs text-white/40 mt-1">
                  Your file is stored securely.
                </p>

              </div>


              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-lg mb-2">
                  #
                </p>

                <p className="text-sm font-semibold">
                  File hashing
                </p>

                <p className="text-xs text-white/40 mt-1">
                  A unique hash verifies integrity.
                </p>

              </div>


              <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                <p className="text-lg mb-2">
                  ⛓
                </p>

                <p className="text-sm font-semibold">
                  Blockchain proof
                </p>

                <p className="text-xs text-white/40 mt-1">
                  The hash is anchored on-chain.
                </p>

              </div>

            </div>


            {/* PROGRESS */}

            {step && (

              <div className="rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-4">

                <div className="flex items-center gap-3">

                  <div className="w-5 h-5 border-2 border-[#5EEAD4] border-t-transparent rounded-full animate-spin" />

                  <p className="text-sm text-[#5EEAD4]">
                    {step}
                  </p>

                </div>

              </div>

            )}


            {/* ERROR */}

            {error && (

              <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4">

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>

            )}


            {/* SUBMIT BUTTON */}

            <button
              className="w-full rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] py-4 font-bold text-[#04121A] shadow-lg shadow-[#14B8A6]/20 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={busy}
            >

              {busy
                ? "Processing secure upload..."
                : "Upload & anchor on-chain"}

            </button>


            {/* SECURITY NOTE */}

            <p className="text-center text-xs text-white/35">
              Your file remains under your control. The blockchain stores
              a verification hash, not the actual medical file.
            </p>

          </form>

        </div>

      </main>

    </div>
  );
}