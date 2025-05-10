"use client"; // Mark as Client Component

import { useState } from 'react';

export default function ClientCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-purple-50 p-4 rounded">
      <p className="mb-2">Counter: <span className="font-bold">{count}</span></p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded text-sm"
      >
        Increment
      </button>
      <p className="mt-2 text-sm text-gray-600">
        This is a client component with interactivity
      </p>
    </div>
  );
}