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

return ( <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">

   
  {/* HEADER */}

  <div className="mb-8">

    <p className="text-xs uppercase tracking-widest text-[var(--button-primary)] font-bold mb-3">
      Secure medical records
    </p>

    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
      Upload a medical record
    </h1>

    <p className="text-[var(--text-secondary)] mt-3 max-w-2xl">
      Add a new medical record to your personal health vault.
      The file hash will be recorded on the blockchain to verify
      its integrity and ownership.
    </p>

  </div>


  {/* UPLOAD CARD */}

  <div className="card">

    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >

      {/* RECORD TYPE */}

      <div>

        <label className="label">
          Record type
        </label>

        <select
          className="input"
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

        <label className="label">
          Medical file
        </label>

        <label
          htmlFor="medical-file"
          className={`block cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition ${
            file
              ? "border-primary bg-primary-soft"
              : "border-border bg-[var(--bg-input)] hover:border-primary hover:bg-primary-soft"
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

              <p className="font-semibold text-lg text-[var(--text-primary)]">
                Choose a medical file
              </p>

              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Click here to browse your computer
              </p>

              <p className="text-xs text-[var(--text-secondary)] mt-4">
                PDF · JPG · PNG · DICOM · DOC · DOCX
              </p>
            </>

          ) : (

            <>
              <div className="text-4xl mb-4">
                ✓
              </div>

              <p className="font-semibold text-primary">
                File selected
              </p>

              <p className="text-sm text-[var(--text-primary)] mt-2 break-all">
                {file.name}
              </p>

              <p className="text-xs text-[var(--text-secondary)] mt-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>

          )}

        </label>

        <p className="text-xs text-[var(--text-secondary)] mt-2">
          Maximum file size: 15MB
        </p>

      </div>


      {/* SECURITY INFORMATION */}

      <div className="grid md:grid-cols-3 gap-3">

        <div className="card">

          <p className="text-lg mb-2">
            🔐
          </p>

          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Secure storage
          </p>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Your file is stored securely.
          </p>

        </div>


        <div className="card">

          <p className="text-lg mb-2">
            #
          </p>

          <p className="text-sm font-semibold text-[var(--text-primary)]">
            File hashing
          </p>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            A unique hash verifies integrity.
          </p>

        </div>


        <div className="card">

          <p className="text-lg mb-2">
            ⛓
          </p>

          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Blockchain proof
          </p>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            The hash is anchored on-chain.
          </p>

        </div>

      </div>


      {/* PROGRESS */}

      {step && (

        <div className="rounded-lg border border-primary bg-primary-soft p-4">

          <div className="flex items-center gap-3">

            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />

            <p className="text-sm text-primary">
              {step}
            </p>

          </div>

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="rounded-lg border border-red-300 bg-red-50 p-4">

          <p className="text-sm text-danger">
            {error}
          </p>

        </div>

      )}


      {/* SUBMIT BUTTON */}

      <button
        className="btn-primary w-full py-3"
        type="submit"
        disabled={busy}
      >

        {busy
          ? "Processing secure upload..."
          : "Upload & anchor on-chain"}

      </button>


      {/* SECURITY NOTE */}

      <p className="text-center text-xs text-[var(--text-secondary)]">
        Your file remains under your control. The blockchain stores
        a verification hash, not the actual medical file.
      </p>

    </form>

  </div>

</div>
   

);
}
