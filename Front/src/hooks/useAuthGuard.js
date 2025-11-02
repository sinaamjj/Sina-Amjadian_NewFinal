import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TOKEN_KEYS = ["accessToken", "token"];

export function useAuthGuard({ toastOnFail = true } = {}) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasToken = TOKEN_KEYS.some((key) => {
      const value = window.localStorage.getItem(key);
      return typeof value === "string" && value.trim();
    });

    if (!hasToken) {
      if (toastOnFail) {
        toast.info("لطفاً ابتدا وارد شوید");
      }
      setAuthorized(false);
      setChecking(false);
      return;
    }

    setAuthorized(true);
    setChecking(false);
  }, [toastOnFail]);

  return { authorized, checking };
}
