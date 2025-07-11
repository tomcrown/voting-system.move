// src/components/CreatePoll.tsx
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { PACKAGE_ID } from "../../constants";

export function CreatePoll() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [deadline, setDeadline] = useState<number>(Math.floor(Date.now() / 1000) + 3600);;


  const { mutate: createPoll } = useSignAndExecuteTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::poll::create_poll`,
      arguments: [
        tx.pure.string(title),
        tx.pure.vector('string', options),
        tx.pure.u64(deadline), 
        tx.object("0x6")
      ],
    });

    createPoll(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          alert("Poll created!");
          setTitle("");
          setOptions(["", ""]);
        },
        onError: (err) => {
          alert(`Failed to create poll: ${err.message}`);
        },
      }
    );
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">Create a New Poll</h2>

      <input
        className="border p-2 w-full rounded"
        placeholder="Poll Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {options.map((opt, i) => (
        <input
          key={i}
          className="border p-2 w-full rounded"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => updateOption(i, e.target.value)}
          required
        />
      ))}

      <input
        className="border p-2 w-full rounded"
        placeholder="Deadline (UTC timestamp)"
        type="number"
        value={deadline}
        onChange={(e) => setDeadline(Number(e.target.value))}
        required
      />


      <button
        type="button"
        onClick={() => setOptions([...options, ""])}
        className="text-blue-600 underline"
      >
        + Add Option
      </button>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Poll
      </button>
    </form>
  );
}
