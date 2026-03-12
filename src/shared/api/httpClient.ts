import axios from "axios";
import { createApiClient } from "./createApiClient";

export const BASE_URL = import.meta.env.VITE_API_URL ?? "https://dummyjson.com";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Для неавторизованных пользователей без интерцепторов
export const httpClient = createApiClient(instance);
