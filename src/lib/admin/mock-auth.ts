const STORE = typeof localStorage !== "undefined" ? localStorage : null;

export const SESSION_KEY = "sanam_admin_token";
export const USER_KEY = "sanam_admin_user";
const SESSION_EVENT = "sanam_admin_session_change";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function subscribeSession(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(SESSION_EVENT, onStoreChange);
  return () =>
    window.removeEventListener(SESSION_EVENT, onStoreChange);
}

export function setMockAdminSession(token: string, user?: SessionUser): void {
  if (!STORE) return;
  STORE.setItem(SESSION_KEY, token);
  if (user) {
    STORE.setItem(USER_KEY, JSON.stringify(user));
  }
  setCookie(SESSION_KEY, token, 7);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession(): void {
  if (!STORE) return;
  STORE.removeItem(SESSION_KEY);
  STORE.removeItem(USER_KEY);
  deleteCookie(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getToken(): string | null {
  if (!STORE) return null;
  return STORE.getItem(SESSION_KEY);
}

let cachedUser: SessionUser | null = null;
let lastRaw = "";

export function getSessionUser(): SessionUser | null {
  if (!STORE) return null;
  const raw = STORE.getItem(USER_KEY) || "";
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
