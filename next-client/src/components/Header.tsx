"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="bg-white shadow w-full">
      <div className="max-w-sm w-full mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Recipita" className="h-6 w-6" />
          <h1 className="text-blue-700 font-bold text-lg">Recipita</h1>
        </div>

        {user && (
          <div className="text-sm text-blue-700 text-right">
            <p>{user.isAnonymous ? "ゲスト" : user.email}</p>
            <button
              onClick={handleLogout}
              className="text-xs underline text-red-500 mt-1"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
