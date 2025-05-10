import { Suspense } from 'react';
import ServerComponent from '../components/server/ServerComponent';
import ClientCounter from '../components/client/ClientCounter';

export default function MicroAppHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Micro App Home</h1>
      
      <div className="grid gap-6">
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Server Component</h2>
          <Suspense fallback={<div>Loading server data...</div>}>
            <ServerComponent />
          </Suspense>
        </section>
        
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Client Component</h2>
          <ClientCounter />
        </section>
      </div>
    </div>
  );
}