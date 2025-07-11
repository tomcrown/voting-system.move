// src/App.tsx
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { CreatePoll } from './containers/Creator/CreatePoll';
import { VoteOnPoll } from './containers/Voter/VoteOnPoll';
import { FinalizePoll } from "./containers/Creator/FinalizePoll";
import { PollResults } from "./containers/Creator/PollResults";



function App() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🗳️ Sui Voting DApp</h1>
        <ConnectButton />
      </header>

      {account ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CreatePoll />
          <VoteOnPoll />
          <FinalizePoll />
          <PollResults />
        </div>
      ) : (
        <p className="text-gray-700 text-lg">Connect wallet to continue.</p>
      )}
    </div>
  );
}

export default App;
