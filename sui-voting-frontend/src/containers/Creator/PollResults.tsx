// src/components/PollResults.tsx
import { useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

export function PollResults() {
  const [pollId, setPollId] = useState("");
  const [results, setResults] = useState<any>(null);
  const client = useSuiClient();

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const poll = await client.getObject({
        id: pollId,
        options: { showContent: true },
      });

      const fields = (poll.data?.content as any)?.fields;

      setResults(fields);
    } catch (err) {
      alert("Failed to fetch poll: " + (err as any).message);
    }
  };

  return (
    <form onSubmit={handleFetch} className="p-4 border rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">View Poll Results</h2>

      <input
        className="border p-2 w-full rounded"
        placeholder="Poll Object ID"
        value={pollId}
        onChange={(e) => setPollId(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Fetch Results
      </button>

      {results && (
        <div className="mt-4 space-y-1">
          <p><strong>Title:</strong> {results.title}</p>
          <p><strong>Status:</strong> {results.status}</p>
          <p><strong>Options:</strong></p>
          <ul className="list-disc pl-5">
            {results.options.fields.contents.map((opt: string, i: number) => (
              <li key={i}>
                {opt}: {results.votes.fields.contents[i]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
