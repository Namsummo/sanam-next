import type { AuthUser } from "@/shared/services/auth-api";

const SESSION_EVENT = "sanam_admin_session_change";
const ACCESS_TOKEN_KEY = "sanam_admin_token";
const USER_KEY = "sanam_admin_user";

export type SessionUser = AuthUser;

function getStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie =
    name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
}

function notifySessionChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeSession(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(SESSION_EVENT, onStoreChange);
  return () => window.removeEventListener(SESSION_EVENT, onStoreChange);
}

/** Persist JWT + user after successful login. */
export function setSession(token: string, user?: SessionUser): void {
  const store = getStore();
  if (!store) return;

  store.setItem(ACCESS_TOKEN_KEY, token);
  if (user) {
    store.setItem(USER_KEY, JSON.stringify(user));
    cachedUser = user;
    lastRaw = JSON.stringify(user);
  }

  setCookie(ACCESS_TOKEN_KEY, token, 7);
  notifySessionChange();
}

/** Clear session on logout. */
export function clearSession(): void {
  const store = getStore();
  if (!store) return;

  store.removeItem(ACCESS_TOKEN_KEY);
  store.removeItem(USER_KEY);
  cachedUser = null;
  lastRaw = "";
  deleteCookie(ACCESS_TOKEN_KEY);
  notifySessionChange();
}

/** JWT used as Authorization: Bearer … for admin API calls. */
export function getAccessToken(): string | null {
  const store = getStore();
  if (!store) return null;
  return store.getItem(ACCESS_TOKEN_KEY);
}

let cachedUser: SessionUser | null = null;
let lastRaw = "";

export function getCurrentUser(): SessionUser | null {
  const store = getStore();
  if (!store) return null;

  const raw = store.getItem(USER_KEY) || "";
  if (raw === lastRaw) return cachedUser;
  lastRaw = raw;

  if (!raw) {
    cachedUser = null;
    return null;
  }

  try {
    cachedUser = JSON.parse(raw) as SessionUser;
    return cachedUser;
  } catch {
    cachedUser = null;
    return null;
  }
}

/** Only allow same-origin admin paths to avoid open redirects. */
export function getSafeAdminNextPath(
  candidate: string | null | undefined,
): string {
  if (!candidate) return "/admin";
  if (!candidate.startsWith("/admin")) return "/admin";
  if (candidate.startsWith("//")) return "/admin";
  if (candidate.startsWith("/admin/login")) return "/admin";
  return candidate;
}
