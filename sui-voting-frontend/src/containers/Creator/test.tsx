// // src/containers/Creator/CreatePoll.tsx
// 'use client';

// import { useState } from 'react';
// import { TransactionBlock } from '@mysten/sui.js/transactions';
// import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';
// import { PACKAGE_ID } from '@/lib/constants';
// import {
//   useCurrentAccount,
//   useSignTransaction,
// } from '@mysten/dapp-kit';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';

// export default function CreatePoll() {
//   const [title, setTitle] = useState('');
//   const [options, setOptions] = useState('');
//   const [deadlineMinutes, setDeadlineMinutes] = useState(5);
//   const { mutate: signAndExecute } = useSignTransaction();
//   const account = useCurrentAccount();

//   const handleCreatePoll = async () => {
//     if (!account) {
//       alert('Connect your wallet first.');
//       return;
//     }

//     const validOptions = options
//       .split(',')
//       .map((opt) => opt.trim())
//       .filter((opt) => opt !== '');

//     if (!title || validOptions.length < 2) {
//       alert('Please enter a title and at least 2 options.');
//       return;
//     }

//     const tx = new TransactionBlock();
//     tx.moveCall({
//       target: `${PACKAGE_ID}::poll::create_poll`,
//       arguments: [
//         tx.pure(title, 'string'),
//         tx.pure(validOptions, `vector<string>`),
//         tx.pure(deadlineMinutes * 60_000, 'u64'), // deadline in ms
//         tx.object(SUI_CLOCK_OBJECT_ID),
//       ],
//     });

//     signAndExecute(
//       {
//         transaction: tx,
//         chain: 'sui:testnet',
//         account,
//       },
//       {
//         onSuccess: () => {
//           alert('Poll created successfully!');
//           setTitle('');
//           setOptions('');
//         },
//         onError: (e) => {
//           console.error('Transaction error:', e);
//           alert('Failed to create poll.');
//         },
//       },
//     );
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 space-y-4">
//       <h2 className="text-2xl font-bold">Create a New Poll</h2>
//       <Input
//         placeholder="Poll title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <Textarea
//         placeholder="Comma-separated options (e.g., Option A, Option B)"
//         value={options}
//         onChange={(e) => setOptions(e.target.value)}
//       />
//       <Input
//         type="number"
//         min={1}
//         value={deadlineMinutes}
//         onChange={(e) => setDeadlineMinutes(parseInt(e.target.value))}
//         placeholder="Deadline in minutes"
//       />
//       <Button onClick={handleCreatePoll}>Create Poll</Button>
//     </div>
//   );
// }
