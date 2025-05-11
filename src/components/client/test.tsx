// Source App: How to serialize the component
"use client";

import { serializeComponent } from "./ComponentSerializer";
import ClientCounter from "./ClientCounter";

// Example of serializing the component for transport
export function ExportComponentExample() {
  // Serialize the component
  const serializedCounter = serializeComponent(ClientCounter);

  return (
    <div>
      <h2>Component Serialization</h2>

      {/* Original component */}
      <div className="mb-4">
        <h3>Original Component:</h3>
        <ClientCounter />
      </div>

      {/* Show the serialized string (for demonstration) */}
      <div className="mb-4">
        <h3>Serialized Component:</h3>
        <textarea
          readOnly
          className="w-full h-32 font-mono text-xs border border-gray-300 p-2"
          value={serializedCounter}
        />
      </div>

      {/* In a real app, you would send this string to your API or storage */}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            // Example: sending to API or saving to localStorage
            localStorage.setItem("serializedCounter", serializedCounter);
            alert("Component serialized and saved to localStorage!");
          }}
        >
          Save Serialized Component
        </button>
      </div>
    </div>
  );
}

import { HydratedComponent } from "./ComponentHydrator";
import { useState, useEffect } from "react";

export default function ImportComponentExample() {
  const serializedCounter = serializeComponent(ClientCounter);
  const [serializedComponent, setSerializedComponent] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch this from an API or storage
    const savedComponent = serializedCounter; //localStorage.getItem("serializedCounter");

    if (savedComponent) {
      // @ts-ignore
      setSerializedComponent(savedComponent);
    } else {
      // For demonstration, you might have a fallback
      console.warn("No serialized component found in localStorage");
    }
  }, [serializedCounter]);

  return (
    <div className="p-6">
      {serializedComponent ? (
        <div>
          {/* <ExportComponentExample /> */}
          <HydratedComponent
            serializedContent={serializedComponent}
            // You can override props if needed
            overrideProps={
              {
                // For example: initialCount: 5
              }
            }
          />
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded">
          No serialized component available. Please export one first.
        </div>
      )}
    </div>
  );
}
