import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";

import { getAccessToken, storeAccessToken } from "./auth";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const api = axios.create();

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      console.warn("🚨 401 Unauthorized - Attempting to refresh token...");
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      const axiosError = err as AxiosError;
      const requestUrl = axiosError.config?.url;
      console.log(`🔄 Refreshing access token for request ${requestUrl}`);
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const {
          data: { accessToken },
        } = await api.post<{ accessToken: string }>("/auth/refresh-token");

        mock
          .onGet(/\/data\d+/)
          .reply(200, { message: "Data fetched successfully" });

        storeAccessToken(accessToken);
        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

const mock = new MockAdapter(api, { delayResponse: 300 });

// Simulate all /data* requests failing with 401
mock.onGet(/\/data\d+/).reply(401, { message: "Access token expired" });

// Simulate token refresh
mock.onPost("/auth/refresh-token").reply(200, {
  accessToken: "new-access-token",
});

export default api;
