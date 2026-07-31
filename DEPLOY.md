# Public Deployment Guide

Three pieces, three homes:

| Piece      | Host                         | Free? |
|------------|------------------------------|-------|
| Contract   | Sepolia testnet              | Yes (test ETH) |
| Backend    | Render (web service)         | Yes\* |
| Frontend   | Vercel                       | Yes   |

\* Render free plan has **no persistent disk** — uploaded files are wiped on
every restart/deploy. On-chain hashes survive. See `render.yaml` for the
paid-disk option.

Repo: https://github.com/ShankarBirTamang/MedRecords

---

## 1. MongoDB Atlas (backend database)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register
2. Database Access → add a user with a **plain alphanumeric** password.
3. Network Access → allow `0.0.0.0/0` (so Render can connect).
4. Database → Connect → Drivers → copy the connection string. Add the db name
   after `.net/`:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/medrecords?appName=Cluster0
   ```
   Keep this for step 3.

## 2. Deploy the contract to Sepolia

1. In MetaMask, use a **throwaway** account. Copy its private key
   (Account details → Show private key).
2. Fund it with Sepolia test ETH from a faucet
   (e.g. https://sepoliafaucet.com — needs an Alchemy login).
3. Get a Sepolia RPC URL from https://alchemy.com (free) — looks like
   `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`.
4. Locally:
   ```bash
   cd blockchain
   cp .env.example .env       # fill SEPOLIA_RPC_URL and PRIVATE_KEY
   npm install
   npm run deploy:sepolia
   ```
5. Copy the printed **contract address** — used in step 4 (`REACT_APP_CONTRACT_ADDRESS`).

## 3. Deploy the backend on Render

1. https://render.com → New → **Blueprint** → connect this GitHub repo.
   Render reads `render.yaml` automatically.
2. When prompted, set env var **`MONGO_URI`** to the Atlas string from step 1.
   (`JWT_SECRET` is auto-generated.)
3. Deploy. Note the service URL, e.g.
   `https://medrecords-backend.onrender.com`.
4. Verify: open `https://<your-service>.onrender.com/api/health` → `{"status":"ok"}`.

## 4. Deploy the frontend on Vercel

1. https://vercel.com → Add New → Project → import this GitHub repo.
2. **Root Directory: `frontend`** (important — the repo has 3 subfolders).
3. Framework preset: Create React App (auto-detected).
4. Environment Variables:
   - `REACT_APP_API_URL` = `https://<your-render-service>.onrender.com/api`
   - `REACT_APP_CONTRACT_ADDRESS` = the Sepolia address from step 2
5. Deploy. App opens at `https://<project>.vercel.app`.

## 5. Point MetaMask at Sepolia

Users of the live app switch MetaMask to the **Sepolia** network (built in)
and need a little Sepolia test ETH to sign transactions.

## Redeploy notes

- Change env vars in Vercel/Render → trigger a redeploy (CRA reads env at
  build time only).
- Push to `main` → Vercel and Render auto-redeploy.
