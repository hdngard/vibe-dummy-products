import { httpClient } from "./httpClient";

export interface DummyJsonUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse extends DummyJsonUser {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export const loginRequest = (payload: LoginPayload): Promise<AuthResponse> =>
  httpClient.post<AuthResponse>("/auth/login", {
    ...payload,
    expiresInMins: 30,
  });

export const refreshRequest = (
  refreshToken: string,
): Promise<RefreshResponse> =>
  httpClient.post<RefreshResponse>("/auth/refresh", {
    refreshToken,
    expiresInMins: 30,
  });
