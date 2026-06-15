export const MOCK_ADMIN_ACCOUNT = {
  email: "admin@sanam.org",
  password: "changeme",
} as const;

export function validateMockAdminLogin(
  email: string,
  password: string,
): boolean {
  return (
    email.trim() === MOCK_ADMIN_ACCOUNT.email &&
    password === MOCK_ADMIN_ACCOUNT.password
  );
}

export const MOCK_ADMIN_SESSION_KEY = "sanam_admin_mock_session";
const MOCK_ADMIN_SESSION_EVENT = "sanam_admin_session_change";

export function subscribeMockAdminSession(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(MOCK_ADMIN_SESSION_EVENT, onStoreChange);
  return () =>
    window.removeEventListener(MOCK_ADMIN_SESSION_EVENT, onStoreChange);
}

export function setMockAdminSession(email: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MOCK_ADMIN_SESSION_KEY, email);
  window.dispatchEvent(new Event(MOCK_ADMIN_SESSION_EVENT));
}

export function clearMockAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MOCK_ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event(MOCK_ADMIN_SESSION_EVENT));
}

export function getMockAdminSession(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(MOCK_ADMIN_SESSION_KEY);
}
