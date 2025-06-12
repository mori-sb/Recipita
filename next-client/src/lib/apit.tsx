// lib/api.ts
import { auth } from "./firebase";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("ログインしていません");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
