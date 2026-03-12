import { loginRequest } from "@/shared/api/auth";
import { setOnUnauthorized } from "@/shared/api/apiClient";
import {
  clearAuthFromStorage,
  getStoredToken,
  getStoredUser,
  saveAuthToStorage,
  type StoredAuthData,
  type StoredUser,
} from "@/shared/api/storage";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";

export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface AuthContextValue {
  token: string | null;
  user: StoredUser | null;
  login: (values: LoginFormValues) => void;
  logout: () => void;
  isLoggingIn: boolean;
  loginError: Error | null;
}

export interface AuthNavigation {
  navigateToLogin: () => void;
  navigateAfterLogin: (redirectPath: string) => void;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useRouterNavigation(): AuthNavigation {
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo(
    () => ({
      navigateToLogin: () => navigate("/login", { replace: true }),
      navigateAfterLogin: (path: string) => navigate(path, { replace: true }),
      getRedirectPath: () =>
        (location.state as { from?: Location } | null)?.from?.pathname ??
        "/products",
    }),
    [navigate, location.state],
  );
}

export const AuthProvider = ({
  children,
  navigation: injectedNavigation,
}: {
  children: ReactNode;
  navigation?: AuthNavigation;
}) => {
  const routerNavigation = useRouterNavigation();
  const navigation = injectedNavigation ?? routerNavigation;

  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<StoredUser | null>(getStoredUser);

  const logout = useCallback(() => {
    clearAuthFromStorage();
    setToken(null);
    setUser(null);
    navigation.navigateToLogin();
  }, [navigation]);

  useEffect(() => {
    setOnUnauthorized(logout);
    return () => setOnUnauthorized(null);
  }, [logout]);

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      loginRequest({
        username: values.username,
        password: values.password,
      }),
    onSuccess: (data, variables) => {
      const newUser: StoredUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      const authData: StoredAuthData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: newUser,
      };

      saveAuthToStorage(authData, variables.rememberMe);
      setToken(data.accessToken);
      setUser(newUser);

      navigation.navigateAfterLogin(navigation.getRedirectPath());
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      login: mutation.mutate,
      logout,
      isLoggingIn: mutation.isPending,
      loginError: mutation.error,
    }),
    [token, user, mutation.mutate, mutation.isPending, mutation.error, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
