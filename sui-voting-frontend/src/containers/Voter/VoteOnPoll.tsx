// src/components/VoteOnPoll.tsx
import {
  useSignAndExecuteTransaction, useCurrentAccount
} from "@mysten/dapp-kit";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../../constants";

export function VoteOnPoll() {
  const account = useCurrentAccount();
  const { mutate: votePoll } = useSignAndExecuteTransaction();
  const [pollId, setPollId] = useState("");
  const [option, setOption] = useState("");

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::poll::vote`,
      arguments: [tx.object(pollId), tx.pure.u64(option), tx.pure.address(account?.address as string), tx.object("0x6"), ],
    });

    votePoll(
      { transaction: tx },
      {
        onSuccess: () => {
          alert("Voted successfully!");
          setPollId("");
          setOption("");
        },
        onError: (err) => alert("Voting failed: " + err.message),
      }
    );
  };

  return (
    <form onSubmit={handleVote} className="p-4 border rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">Vote on a Poll</h2>

      <input
        className="border p-2 w-full rounded"
        placeholder="Poll Object ID"
        value={pollId}
        onChange={(e) => setPollId(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Option (string)"
        value={option}
        onChange={(e) => setOption(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Vote
      </button>
    </form>
  );
}
