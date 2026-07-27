import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
connectWallet,
signMessage,
isMetaMaskInstalled,
} from "../services/web3";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
const navigate = useNavigate();
const { login } = useAuth();
const { theme, toggleTheme } = useTheme();

const [walletAddress, setWalletAddress] = useState("");
const [mode, setMode] = useState("login");

const [form, setForm] = useState({
name: "",
email: "",
role: "patient",
});

const [error, setError] = useState("");
const [busy, setBusy] = useState(false);

async function handleConnect() {
setError("");

   
try {
  const addr = await connectWallet();
  setWalletAddress(addr);
} catch (err) {
  setError(err.message);
}
   

}

async function handleAuth(e) {
e.preventDefault();
setError("");
setBusy(true);

   
try {
  const addr = walletAddress || (await connectWallet());

  if (!walletAddress) {
    setWalletAddress(addr);
  }

  const { data: nonceData } = await api.post("/auth/nonce", {
    walletAddress: addr,
  });

  const signature = await signMessage(nonceData.message);

  let res;

  if (mode === "login") {
    res = await api.post("/auth/login", {
      walletAddress: addr,
      signature,
    });
  } else {
    res = await api.post("/auth/register", {
      walletAddress: addr,
      signature,
      name: form.name,
      email: form.email,
      role: form.role,
    });
  }

  login(res.data.token, res.data.user);

  const role = res.data.user.role;

  navigate(
    role === "doctor"
      ? "/doctor"
      : role === "admin"
      ? "/admin"
      : "/patient"
  );
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.message ||
      "Something went wrong"
  );
} finally {
  setBusy(false);
}
   

}

return ( <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center p-6 relative overflow-hidden">
  <button
    onClick={toggleTheme}
    className="absolute top-6 right-6 z-20 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] shadow-card transition hover:bg-[var(--button-primary-soft)]"
  >
    {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
   
  {/* BACKGROUND GLOW */}
  <div className="absolute inset-0 pointer-events-none">

   <div
      className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10"
      style={{ backgroundColor: "var(--button-primary)" }}
    />

      <div
      className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
      style={{ backgroundColor: "var(--button-primary)" }}
    />

  </div>


  {/* MAIN CONTAINER */}
  <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">


    {/* LEFT SIDE — BRANDING */}
    <div className="hidden lg:block px-8">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">

        <img
          src="/medrecords-logo.png"
          alt="MedRecords Logo"
          className="w-14 h-14 object-contain"
        />

        <span className="text-2xl font-extrabold tracking-tight">
          MedRecords
        </span>

      </div>


      {/* HEADING */}
      <p className="text-sm uppercase tracking-widest text-[var(--button-primary)] font-semibold mb-5">
        Patient-owned · Blockchain-verified
      </p>

      <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">

        Your health data
        <br />

        belongs to{" "}

        <span className="text-[var(--button-primary)]">
          you.
        </span>

      </h1>

      <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-lg mb-10">

        Access your medical records securely, control who can view them,
        and verify every record through blockchain technology.

      </p>


      {/* FEATURE CARDS */}
      <div className="space-y-4">

        <div className="card flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-[var(--button-primary)]/10 flex items-center justify-center text-[var(--button-primary)] text-xl">
            ✓
          </div>

          <div>

            <p className="font-semibold">
              Patient-controlled access
            </p>

            <p className="text-sm text-[var(--text-secondary)]">
              You decide who can access your records.
            </p>

          </div>

        </div>


        <div className="card flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-[var(--button-primary)]/10 flex items-center justify-center text-[var(--button-primary)] text-xl">
            ⛓
          </div>

          <div>

            <p className="font-semibold">
              Blockchain verified
            </p>

            <p className="text-sm text-[var(--text-secondary)]">
              Every record can be verified for integrity.
            </p>

          </div>

        </div>


        <div className="card flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-[var(--button-primary)]/10 flex items-center justify-center text-[var(--button-primary)] text-xl">
            ◈
          </div>

          <div>

            <p className="font-semibold">
              No passwords required
            </p>

            <p className="text-sm text-[var(--text-secondary)]">
              Your wallet signature proves your identity.
            </p>

          </div>

        </div>

      </div>

    </div>


    {/* RIGHT SIDE — LOGIN CARD */}
    <div className="w-full max-w-md mx-auto">


      {/* MOBILE LOGO */}
      <div className="lg:hidden text-center mb-8">

        <img
          src="/medrecords-logo.png"
          alt="MedRecords Logo"
          className="w-16 h-16 object-contain mx-auto mb-4"
        />

        <h1 className="text-2xl font-extrabold">
          MedRecords
        </h1>

        <p className="text-[var(--text-secondary)] text-sm mt-2">
          Your health data. Your ownership.
        </p>

      </div>


      {/* CARD */}
      <div className="card p-7 rounded-[28px] shadow-card">


        {/* CARD HEADER */}
        <div className="mb-7">

          <p className="text-[var(--button-primary)] text-xs uppercase tracking-widest font-bold mb-3">
            Secure access
          </p>

          <h2 className="text-3xl font-extrabold">

            {mode === "login"
              ? "Welcome back"
              : "Create your account"}

          </h2>

          <p className="text-[var(--text-secondary)] text-sm mt-2">

            {mode === "login"
              ? "Connect your wallet to access your medical records."
              : "Create your patient-owned medical record account."}

          </p>

        </div>


        {/* LOGIN / REGISTER TOGGLE */}
        <div className="flex bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl p-1 mb-6">

          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
              mode === "login"
                ? "bg-[var(--button-primary)] text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
              mode === "register"
                ? "bg-[var(--button-primary)] text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Register
          </button>

        </div>


        {/* METAMASK WARNING */}
        {!isMetaMaskInstalled() && (

          <div className="mb-5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">

            MetaMask not detected. Please install MetaMask to continue.

          </div>

        )}


        {/* WALLET BUTTON */}
        <button
          className="w-full mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:bg-[var(--button-primary-soft)] py-3.5 transition flex items-center justify-center gap-3 font-semibold"
          onClick={handleConnect}
          type="button"
        >

          <span className="text-xl">
            🦊
          </span>

          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect MetaMask Wallet"}

        </button>


        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-6">

          <div className="h-px flex-1 bg-[var(--border-color)]" />

          <span className="text-xs text-[var(--text-secondary)]">

            {walletAddress
              ? "Wallet connected"
              : "Connect wallet to continue"}

          </span>

          <div className="h-px flex-1 bg-[var(--border-color)]" />

        </div>


        {/* FORM */}
        <form
          onSubmit={handleAuth}
          className="space-y-4"
        >

          {mode === "register" && (

            <>

              <div>

                <label className="label">
                  Full name
                </label>

                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Jane Doe"
                />

              </div>


              <div>

                <label className="label">
                  Email
                </label>

                <input
                  className="input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="jane@example.com"
                />

              </div>


              <div>

                <label className="label">
                  I am a
                </label>

                <select
                  className="input"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                >

                  <option value="patient">
                    Patient
                  </option>

                  <option value="doctor">
                    Doctor
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>

              </div>

            </>

          )}


          {/* ERROR */}
          {error && (

            <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">

              {error}

            </div>

          )}


          {/* SUBMIT */}
          <button
            className="w-full rounded-xl bg-[var(--button-primary)] py-4 font-bold text-white shadow-lg hover:bg-[var(--button-primary-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={busy}
          >

            {busy
              ? "Waiting for signature..."
              : mode === "login"
              ? "Sign in with wallet"
              : "Create account"}

          </button>

        </form>


        {/* FOOTER MESSAGE */}
        <p className="text-center text-xs text-[var(--text-secondary)] mt-6">

          No passwords. Your MetaMask signature proves who you are.

        </p>

      </div>


      {/* BOTTOM TEXT */}
      <p className="text-center text-xs text-[var(--text-secondary)] mt-6">

        © 2026 MedRecords · Patient-owned healthcare infrastructure

      </p>

    </div>

  </div>

</div>
   

);
}
