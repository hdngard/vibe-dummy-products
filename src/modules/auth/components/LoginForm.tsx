import { getStoredRememberMe } from "@/shared/api/storage";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ClearIcon from "@/shared/assets/icon-clear.svg?react";
import EyeOffIcon from "@/shared/assets/icon-eye-off.svg?react";
import LockIcon from "@/shared/assets/icon-lock.svg?react";
import UserIcon from "@/shared/assets/icon-user.svg?react";
import LogoIcon from "@/shared/assets/logo.svg?react";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Введите логин"),
  password: z.string().trim().min(1, "Введите пароль"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: getStoredRememberMe(),
    },
  });

  const { login, isLoggingIn, loginError } = useAuth();

  const usernameValue = watch("username");
  const rememberMeValue = watch("rememberMe");

  const onSubmit = (values: LoginFormValues) =>
    login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberMe,
    });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="flex w-full max-w-[515px] flex-col items-center gap-8 rounded-[34px] border border-border bg-background/95 px-[58px] py-12 shadow-sm">
        <LogoIcon width={52} height={52} />

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[40px] font-semibold leading-[44px] tracking-[-0.6px] text-foreground">
            Добро пожаловать!
          </h1>
          <p className="text-lg font-medium text-muted-foreground">
            Пожалуйста, авторизируйтесь
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">
                Логин
              </Label>
              <div
                className={cn(
                  "flex h-[55px] w-full items-center gap-3 rounded-xl border px-4 bg-background",
                  errors.username ? "border-destructive" : "border-input",
                )}
              >
                <UserIcon
                  width={24}
                  height={24}
                  className="shrink-0 text-foreground"
                />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Введите логин"
                  {...register("username")}
                  className="h-auto border-none bg-transparent p-0 text-lg font-medium tracking-[-0.27px] text-foreground shadow-none outline-none focus-visible:ring-0"
                />
                {usernameValue && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setValue("username", "")}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <ClearIcon width={14} height={16} />
                  </Button>
                )}
              </div>
              {errors.username && (
                <p className="mt-0.5 text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">
                Пароль
              </Label>
              <div
                className={cn(
                  "flex h-[55px] w-full items-center gap-3 rounded-xl border px-4 bg-background",
                  errors.password ? "border-destructive" : "border-input",
                )}
              >
                <LockIcon
                  width={18}
                  height={20}
                  className="shrink-0 text-foreground"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  {...register("password")}
                  className="h-auto border-none bg-transparent p-0 text-lg font-medium tracking-[-0.27px] text-foreground shadow-none outline-none focus-visible:ring-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <EyeOffIcon width={22} height={20} />
                </Button>
              </div>
              {errors.password && (
                <p className="mt-0.5 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Checkbox
              checked={rememberMeValue ?? false}
              onChange={(checked) => setValue("rememberMe", checked)}
              size="sm"
              aria-label="Запомнить данные"
            />
            <span className="text-sm font-medium text-muted-foreground">
              Запомнить данные
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {loginError && (
              <p className="text-center text-sm text-destructive">
                {loginError.message || "Ошибка авторизации"}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="h-[55px] w-full rounded-xl text-lg font-semibold tracking-[-0.18px]"
            >
              {isLoggingIn ? "Входим..." : "Войти"}
            </Button>

            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium">или</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
        </form>

        <p className="text-center text-lg font-normal text-muted-foreground">
          Нет аккаунта?{" "}
          <a
            className="font-normal text-primary no-underline hover:underline"
          >
            Создать
          </a>
        </p>
      </div>
    </div>
  );
};
