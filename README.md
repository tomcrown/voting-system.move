# 🗳️ Sui Voting System

A fully on-chain voting system built with Sui Move and connected to a basic React frontend.  
Create polls, cast votes, view live results, and finalize decisions — all stored on the Sui blockchain.

> ⚠️ The frontend may not win design awards, but it gets the job done 😉

GitHub Repo: [github.com/tomcrown/voting-system.move](https://github.com/tomcrown/voting-system.move)

---

## 🧠 Features

- ✅ Create polls on-chain
- ✅ Vote once per wallet address
- ✅ View real-time results
- ✅ Finalize polls after voting ends
- ✅ All logic fully on-chain — no backend required

---

## 🧱 Tech Stack

- **Smart Contract**: Sui Move  
- **Frontend**: React + Vite  
- **Wallet Integration**: `@mysten/dapp-kit`  
- **Network**: Sui Testnet

---

## 📦 Smart Contract

**Package ID**  
0x937f16d260a2d5b9b5245116846cc6d4b595a3293dcfe0d7f82f17a4498893fb


**Module**: `voting::poll`

### Key Entry Functions

```move
entry fun create_poll(...)
entry fun vote(...)
public fun get_results(...)
entry fun end_poll(...)
Each poll and vote is stored as a distinct object on-chain.


🚀 Getting Started
1. Clone the repo
git clone https://github.com/tomcrown/voting-system.move.git
cd voting-system.move

2. Install dependencies
pnpm install
# or
npm install

3. Start the frontend
pnpm dev
# or
npm run dev
Make sure you're connected to the Sui Testnet via a supported wallet like Sui Wallet.


💡 Demo Flow
✅ Connect wallet

✅ Create a poll

✅ Vote on it (1 vote per address)

✅ View live results

✅ End the poll and finalize outcome

Note: Frontend is super basic — but it does let you interact with everything on-chain!

🤝 Contributions
PRs, feedback, and suggestions are welcome!
Feel free to fork the repo or open an issue.

👋 Author
@tomcrown
Learning and building in public on Sui.

🐣 Disclaimer
This project was built for educational and portfolio purposes.
While the core logic is secure, it is not audited. Please use at your own risk.

---
