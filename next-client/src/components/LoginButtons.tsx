"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginButtons() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      console.log(
        "ログイン状態:",
        u?.uid,
        u?.isAnonymous ? "(ゲスト)" : "(本登録)"
      );
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginAsGuest = async () => {
    await signInAnonymously(auth);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="space-y-2 text-center">
      {user ? (
        <>
          <p>ログイン中：{user.isAnonymous ? "ゲスト" : user.email}</p>
          <button onClick={logout} className="bg-red-200 px-4 py-2 rounded">
            ログアウト
          </button>
        </>
      ) : (
        <>
          <button
            onClick={loginWithGoogle}
            className="bg-blue-200 px-4 py-2 rounded"
          >
            Googleでログイン
          </button>
          <br />
          <button
            onClick={loginAsGuest}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            ゲストとして使う
          </button>
        </>
      )}
    </div>
  );
}
