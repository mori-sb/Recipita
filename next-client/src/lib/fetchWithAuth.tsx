import { auth } from "./firebase";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = await auth.currentUser?.getIdToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
