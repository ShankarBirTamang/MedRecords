import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { connectWallet, signMessage, isMetaMaskInstalled } from "../services/web3";
import { useAuth } from "../context/AuthContext";

export default function Login() {
const navigate = useNavigate();
const { login } = useAuth();

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

return ( <div className="min-h-screen bg-[#060F26] text-white flex items-center justify-center p-6 relative overflow-hidden">

    
  {/* Background Glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#5B8DEF]/20 rounded-full blur-3xl" />
  </div>

  {/* Main Container */}
  <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

    {/* LEFT SIDE — BRANDING */}
    <div className="hidden lg:block px-8">

      {/* Logo */}
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

      {/* Heading */}
      <p className="text-sm uppercase tracking-widest text-[#5EEAD4] font-semibold mb-5">
        Patient-owned · Blockchain-verified
      </p>

      <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
        Your health data
        <br />
        belongs to{" "}
        <span className="bg-gradient-to-r from-[#5EEAD4] to-[#5B8DEF] bg-clip-text text-transparent">
          you.
        </span>
      </h1>

      <p className="text-white/60 text-lg leading-relaxed max-w-lg mb-10">
        Access your medical records securely, control who can view them,
        and verify every record through blockchain technology.
      </p>

      {/* Feature Cards */}
      <div className="space-y-4">

        <div className="flex items-center gap-4 bg-white/[0.06] border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="w-11 h-11 rounded-xl bg-[#14B8A6]/20 flex items-center justify-center text-[#5EEAD4] text-xl">
            ✓
          </div>

          <div>
            <p className="font-semibold">
              Patient-controlled access
            </p>

            <p className="text-sm text-white/50">
              You decide who can access your records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.06] border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="w-11 h-11 rounded-xl bg-[#5B8DEF]/20 flex items-center justify-center text-[#8AAFFF] text-xl">
            ⛓
          </div>

          <div>
            <p className="font-semibold">
              Blockchain verified
            </p>

            <p className="text-sm text-white/50">
              Every record can be verified for integrity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/[0.06] border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl">
            ◈
          </div>

          <div>
            <p className="font-semibold">
              No passwords required
            </p>

            <p className="text-sm text-white/50">
              Your wallet signature proves your identity.
            </p>
          </div>
        </div>

      </div>
    </div>

    {/* RIGHT SIDE — LOGIN CARD */}
    <div className="w-full max-w-md mx-auto">

      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
       <img
        src="/medrecords-logo.png"
        alt="MedRecords Logo"
        className="w-16 h-16 object-contain mx-auto mb-4"
        />

        <h1 className="text-2xl font-extrabold">
          MedRecords
        </h1>

        <p className="text-white/50 text-sm mt-2">
          Your health data. Your ownership.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/[0.08] border border-white/15 rounded-[28px] p-7 backdrop-blur-2xl shadow-2xl">

        {/* Card Header */}
        <div className="mb-7">
          <p className="text-[#5EEAD4] text-xs uppercase tracking-widest font-bold mb-3">
            Secure access
          </p>

          <h2 className="text-3xl font-extrabold">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>

          <p className="text-white/50 text-sm mt-2">
            {mode === "login"
              ? "Connect your wallet to access your medical records."
              : "Create your patient-owned medical record account."}
          </p>
        </div>

        {/* Login/Register Toggle */}
        <div className="flex bg-black/20 rounded-xl p-1 mb-6">

          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
              mode === "login"
                ? "bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] text-[#04121A]"
                : "text-white/50 hover:text-white"
            }`}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
              mode === "register"
                ? "bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] text-[#04121A]"
                : "text-white/50 hover:text-white"
            }`}
          >
            Register
          </button>

        </div>

        {/* MetaMask Warning */}
        {!isMetaMaskInstalled() && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            MetaMask not detected. Please install MetaMask to continue.
          </div>
        )}

        {/* Wallet Button */}
        <button
          className="w-full mb-6 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] py-3.5 transition flex items-center justify-center gap-3 font-semibold"
          onClick={handleConnect}
          type="button"
        >
          <span className="text-xl">🦊</span>

          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect MetaMask Wallet"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/30">
            {walletAddress
              ? "Wallet connected"
              : "Connect wallet to continue"}
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">

          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Full name
                </label>

                <input
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-[#14B8A6] transition"
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
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email
                </label>

                <input
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-[#14B8A6] transition"
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
                <label className="block text-sm font-medium text-white/70 mb-2">
                  I am a
                </label>

                <select
                  className="w-full rounded-xl border border-white/10 bg-[#0A1B3D] px-4 py-3.5 text-white outline-none focus:border-[#14B8A6] transition"
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

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="w-full rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#5B8DEF] py-4 font-bold text-[#04121A] shadow-lg shadow-[#14B8A6]/20 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Footer Message */}
        <p className="text-center text-xs text-white/35 mt-6">
          No passwords. Your MetaMask signature proves who you are.
        </p>

      </div>

      {/* Bottom Text */}
      <p className="text-center text-xs text-white/30 mt-6">
        © 2026 MedRecords · Patient-owned healthcare infrastructure
      </p>

    </div>

  </div>

</div>
    

);
}
