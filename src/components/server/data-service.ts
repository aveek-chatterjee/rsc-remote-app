export async function getServerData() {
  // Simulate delay from a real data source
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    message: "This data was fetched on the server",
    timestamp: new Date().toDateString(),
    items: [
      { id: 1, name: "Server Item 1" },
      { id: 2, name: "Server Item 2" },
      { id: 3, name: "Server Item 3" }
    ]
  };
}