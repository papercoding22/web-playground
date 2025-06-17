import api from "./api";

export default function RefreshTokenChallenge() {
  const handleMultiRequests = async () => {
    const call = (i: number) =>
      api
        .get(`/data${i}`)
        .then(() => console.log(`✅ Call ${i} success for request /data${i}`))
        .catch(() => console.log(`❌ Call ${i} failed for request /data${i}`));

    await Promise.all([1, 2, 3, 4, 5].map(call));
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>🔐 Token Refresh Demo</h2>
      <p>Initial access token is expired — only one refresh should occur.</p>
      <button onClick={handleMultiRequests}>Fire 5 Parallel Requests</button>
    </div>
  );
}
