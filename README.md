# 🧪 Cypher Blockchain Card Load Analytics

A web app that visualizes and analyzes USD card load patterns on the **Base chain** for Cypher, using historical token prices from **Aerodrome Finance** and real-time blockchain data via `viem`.

🔗 **Live Demo**: [https://stunning-biscotti-c82425.netlify.app](https://stunning-biscotti-c82425.netlify.app)  

---

## 🎯 Objective

Track and visualize crypto-to-USD loads sent to Cypher’s master wallet:
`
0xcCCd218A58B53C67fC17D8C87Cb90d83614e35fD
`

Analyze wallet activity and identify counterparties across the Base chain using on-chain data and public labels.

---

## ✅ Features

### 📊 USD Load Volume (2025)
- Visualizes **daily**, **weekly**, and **monthly** USD load volume.
- Historical pricing via **Aerodrome Finance** Uniswap v3 smart contracts on Base Chain.
- Charts and statistics for fast interpretation.

### 🧑‍💻 Wallet Interaction Analysis
- Input any wallet address to view:
  - Top 10 counterparties by transaction count.
  - Whether each is a wallet, contract, or known protocol/CEX.
  - Known labels (e.g., Coinbase, Uniswap, Base Bridge).

---

## 🧱 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Blockchain Access**: [`viem`](https://viem.sh/) for Base Chain RPC interactions
- **Visualization**: Recharts
- **Build Tool**: Vite
- **Hosting**: Netlify

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/noble-8/Cypher 
cd Cypher 

# Install dependencies
npm install

# Run the app locally
npm run dev

To build for production:
npm run build

