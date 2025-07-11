// src/components/FinalizePoll.tsx
import {
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../../constants";

export function FinalizePoll() {
  const [pollId, setPollId] = useState("");
  const { mutate: finalizePoll } = useSignAndExecuteTransaction();

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::voting::finalize_poll`,
      arguments: [tx.object(pollId)],
    });

    finalizePoll(
      { transaction: tx },
      {
        onSuccess: () => {
          alert("Poll finalized!");
          setPollId("");
        },
        onError: (err) => alert("Finalization failed: " + err.message),
      }
    );
  };

  return (
    <form onSubmit={handleFinalize} className="p-4 border rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">Finalize Poll</h2>

      <input
        className="border p-2 w-full rounded"
        placeholder="Poll Object ID"
        value={pollId}
        onChange={(e) => setPollId(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Finalize
      </button>
    </form>
  );
}
