import { getServerData } from "./data-service";

// This is a Server Component - it will always run on the server
async function ServerComponent(props: any) {
  // Simulate fetching data from database or API
  const data = await getServerData();

  return (
    <div className="bg-blue-50 p-4 rounded" style={{ backgroundColor: "#f0f4ff" }}>
      <h3 className="font-medium mb-2">Server-rendered data:</h3>
      <pre className="bg-blue-100 p-2 rounded text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="mt-2 text-sm text-gray-600">
        This component was rendered at: {data.timestamp}
      </p>
    </div>
  );
}

export default ServerComponent;
