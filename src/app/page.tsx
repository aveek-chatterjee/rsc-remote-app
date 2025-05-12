import { Suspense } from "react";
import ServerComponent from "../components/server/ServerComponent";
import ImportComponentExample from "@/components/client/test";

export default function MicroAppHome() {
  return (
    <div>
      <div className="grid gap-6">
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Server Component</h2>
          <Suspense fallback={<div>Loading server data...</div>}>
            <ServerComponent />
          </Suspense>
        </section>

        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Hydrated Client Component
          </h2>
          <ImportComponentExample />
        </section>
      </div>
    </div>
  );
}
