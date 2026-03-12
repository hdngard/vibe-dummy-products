import { z } from "zod";

export const AUTH_ACCESS_TOKEN_KEY = "authAccessToken";
export const AUTH_REFRESH_TOKEN_KEY = "authRefreshToken";
export const AUTH_USER_KEY = "authUser";
export const AUTH_REMEMBER_ME_KEY = "authRememberMe";

const storedUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type StoredUser = z.infer<typeof storedUserSchema>;

export interface StoredAuthData {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}

export const saveAuthToStorage = (
  auth: StoredAuthData,
  rememberMe: boolean,
): void => {
  const primary = rememberMe ? window.localStorage : window.sessionStorage;
  const other = rememberMe ? window.sessionStorage : window.localStorage;

  primary.setItem(AUTH_ACCESS_TOKEN_KEY, auth.accessToken);
  primary.setItem(AUTH_REFRESH_TOKEN_KEY, auth.refreshToken);
  primary.setItem(AUTH_USER_KEY, JSON.stringify(auth.user));

  other.removeItem(AUTH_ACCESS_TOKEN_KEY);
  other.removeItem(AUTH_REFRESH_TOKEN_KEY);
  other.removeItem(AUTH_USER_KEY);

  window.localStorage.setItem(AUTH_REMEMBER_ME_KEY, JSON.stringify(rememberMe));
};

export const getStoredRememberMe = (): boolean => {
  return window.localStorage.getItem(AUTH_REMEMBER_ME_KEY) === "true";
};

export const clearAuthFromStorage = (): void => {
  window.localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_USER_KEY);
};

export const getStoredToken = (): string | null => {
  return (
    window.localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ??
    window.sessionStorage.getItem(AUTH_ACCESS_TOKEN_KEY)
  );
};

export const getStoredRefreshToken = (): string | null => {
  return (
    window.localStorage.getItem(AUTH_REFRESH_TOKEN_KEY) ??
    window.sessionStorage.getItem(AUTH_REFRESH_TOKEN_KEY)
  );
};

export const getStoredUser = (): StoredUser | null => {
  const raw =
    window.localStorage.getItem(AUTH_USER_KEY) ??
    window.sessionStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    const result = storedUserSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const updateStoredTokens = (
  accessToken: string,
  refreshToken: string,
): void => {
  const targetStorage =
    window.localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) !== null
      ? window.localStorage
      : window.sessionStorage;

  targetStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken);
  targetStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
};

