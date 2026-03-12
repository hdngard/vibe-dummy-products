import axios from "axios";
import { type RefreshResponse, refreshRequest } from "./auth";
import { BASE_URL } from "./httpClient";
import { createApiClient } from "./createApiClient";
import {
  getStoredRefreshToken,
  getStoredToken,
  updateStoredTokens,
} from "./storage";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: (() => void) | null) {
  onUnauthorized = cb;
}

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<RefreshResponse> | null = null;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      onUnauthorized?.();
      return Promise.reject(
        new Error("Сессия истекла. Пожалуйста, войдите снова."),
      );
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshRequest(refreshToken).finally(() => {
          refreshPromise = null;
        });
      }
      const newTokens = await refreshPromise;
      updateStoredTokens(newTokens.accessToken, newTokens.refreshToken);

      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return instance(originalRequest);
    } catch {
      onUnauthorized?.();
      return Promise.reject(
        new Error("Сессия истекла. Пожалуйста, войдите снова."),
      );
    }
  },
);

// Для авторизованных запросов
export const apiClient = createApiClient(instance);
