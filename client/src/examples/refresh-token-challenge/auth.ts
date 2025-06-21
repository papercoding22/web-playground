let accessToken = "expired-token";
const refreshToken = "valid-refresh-token";

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function storeAccessToken(token: string) {
  accessToken = token;
}

export async function refreshAccessToken(): Promise<string> {
  console.log("🔄 Refreshing access token...");
  await new Promise((res) => setTimeout(res, 1000)); // simulate delay
  const newToken = "new-access-token-" + Date.now();
  storeAccessToken(newToken);
  console.log("✅ New token:", newToken);
  return newToken;
}
