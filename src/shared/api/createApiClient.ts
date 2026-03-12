import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { normalizeError } from "./errors";

export function createApiClient(instance: AxiosInstance) {
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.get<T>(url, config).then((r) => r.data).catch(normalizeError),

    post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
      instance.post<T>(url, body, config).then((r) => r.data).catch(normalizeError),

    put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
      instance.put<T>(url, body, config).then((r) => r.data).catch(normalizeError),

    patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
      instance.patch<T>(url, body, config).then((r) => r.data).catch(normalizeError),

    del: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.delete<T>(url, config).then((r) => r.data).catch(normalizeError),
  };
}
