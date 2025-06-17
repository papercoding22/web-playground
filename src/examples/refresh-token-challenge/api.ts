import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { getAccessToken } from "./auth";

const api = axios.create();

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return config;
});

const mock = new MockAdapter(api, { delayResponse: 300 });

// Simulate all /data* requests failing with 401
mock.onGet(/\/data\d+/).reply(401, { message: "Access token expired" });

// Simulate token refresh
mock.onPost("/auth/refresh-token").reply(200, {
  accessToken: "new-access-token",
});

export default api;
