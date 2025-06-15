// lib/api.ts
import { auth } from "./firebase";
import { getIdToken } from "firebase/auth";

async function getAuthToken() {
  if (!auth.currentUser) throw new Error("Not authenticated");
  return getIdToken(auth.currentUser);
}

export const initUser = async (apiUrl: string) => {
  try {
    const res = await fetchWithAuth(`${apiUrl}/api/users/init`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("登録に失敗しました");
    const user = await res.json();
    console.log("✅ 初回ユーザー登録:", user);
  } catch (err) {
    console.error("登録エラー:", err);
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const idToken = await getAuthToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
};

export async function fetchReceiptsByUser(
  apiUrl: string | undefined,
  uid: string
) {
  const idToken = await getAuthToken();
  const res = await fetch(`${apiUrl}/api/receipts/user/${uid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) throw new Error("データ取得に失敗しました");
  return res.json();
}

export async function updateReceipt(apiUrl: string | undefined, receipt: any) {
  const idToken = await getAuthToken();
  const res = await fetch(`${apiUrl}/api/receipts/${receipt.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(receipt),
  });
  if (!res.ok) throw new Error("保存失敗");
  return res.json();
}

export const deleteReceipt = async (apiUrl: string | undefined, id: number) => {
  if (!apiUrl) throw new Error("API URL is undefined");
  const idToken = await getAuthToken();

  const res = await fetch(`${apiUrl}/api/receipts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("削除に失敗しました");
  }
};
