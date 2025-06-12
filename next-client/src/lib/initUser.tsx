import { fetchWithAuth } from "./fetchWithAuth";

export const initUser = async () => {
  try {
    const res = await fetchWithAuth("http://localhost:8080/api/users/init", {
      method: "POST",
    });
    if (!res.ok) throw new Error("登録に失敗しました");
    const user = await res.json();
    console.log("✅ 初回ユーザー登録:", user);
  } catch (err) {
    console.error("登録エラー:", err);
  }
};
