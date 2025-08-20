// src/renderer/useAuth.ts
import { useEffect, useRef, useState } from "react";

type User = { id: number; username: string; role: string; perms: string[] };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const accessRef = useRef<string | null>(null);
  const [refresh, setRefresh] = useState<string | null>(null);
  const [expTimer, setExpTimer] = useState<any>(null);

   // Récupération au mount (si tokens déjà en localStorage)
   useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    const savedUser = localStorage.getItem("user");

    if (savedAccess && savedRefresh && savedUser) {
      accessRef.current = savedAccess;
      setRefresh(savedRefresh);
      setUser(JSON.parse(savedUser));
      scheduleRefresh(savedAccess);
    }
  }, []);

  // login
  const login = async (username: string, password: string) => {
    const res = await window.electron.auth.login(username, password);
    if (!res.ok) throw new Error(res.error);
    accessRef.current = res.access;
    setRefresh(res.refresh);
    setUser(res.user);
    scheduleRefresh(res.access);

    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    localStorage.setItem("user", JSON.stringify(res.user));

    return res;
  };

  // logout
  const logout = async () => {
    if (refresh) await window.electron.auth.logout(refresh);
    accessRef.current = null;
    setRefresh(null);
    setUser(null);
    if (expTimer) clearTimeout(expTimer);

    // Clear localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  };

  // refresh automatique (TTL access ~15m, on rafraîchit à T-60s)
  const scheduleRefresh = (access: string) => {
    try {
      const payload = JSON.parse(atob(access.split(".")[1]));
      const expMs = payload.exp * 1000;
      const delay = Math.max(1000, expMs - Date.now() - 60_000);
      const t = setTimeout(async () => {
        if (!refresh) return;
        const r = await window.electron.auth.refresh(refresh);
        if (r.ok) {
          accessRef.current = r.access;
          setRefresh(r.refresh);
          scheduleRefresh(r.access);
          // Update access en localStorage
          localStorage.setItem("access", r.access);
          localStorage.setItem("refresh", r.refresh);
        } else {
          await logout();
        }
      }, delay);
      setExpTimer(t);
    } catch { }
  };

  // appel protégé
  const call = async <T,>(fn: (access: string) => Promise<T>) => {
    if (!accessRef.current) throw new Error("Not authenticated");
    return fn(accessRef.current);
  };

  return { user, login, logout, call };
}
