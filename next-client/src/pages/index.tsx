import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image"; // ← 追加！
import LoginTriggerButton from "@/components/LoginDialog";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="bg-blue-50 text-gray-900 px-2 pt-3 w-full max-w-sm mx-auto flex flex-col items-center overflow-hidden text-center h-screen">
        <h1 className="text-3xl font-bold text-blue-600">Recipita</h1>
        <p className="text-gray-600">レシートでかんたん家計簿</p>

        {/* キャラクター画像の追加 */}
        <div className="relative w-60 h-48 mt-5 mb-6">
          <Image
            src="/images/recipita-owl.png"
            alt="Recipitaキャラクター"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-green-100 text-green-800 px-3 py-1 text-xs mb-4 rounded-full border border-green-300 shadow inline-block">
          🏅 初心者節約マスター
        </div>

        {user ? (
          <div className="text-sm text-blue-700 mb-4">
            <p>
              {user.isAnonymous ? "ゲストログイン中" : `${user.email} さん`}
            </p>
            <button
              onClick={() => signOut(auth)}
              className="text-red-500 text-xs underline mt-1"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <>
            <LoginTriggerButton />
            <p className="text-gray-700 mb-4 mt-3">ログインしてみよう!</p>
          </>
        )}

        <div className="w-full space-y-4 mt-5">
          <Link
            href="/ocr"
            className="w-11/12 max-w-xs mx-auto flex items-center justify-center gap-3 bg-blue-500 text-white rounded-2xl py-4 px-6 shadow-lg hover:bg-blue-600 transition"
          >
            📷 <span>レシートを読み取り</span>
          </Link>
          <Link
            href="/list"
            className="w-11/12 max-w-xs mx-auto flex items-center justify-center gap-3 bg-white border border-blue-200 text-blue-700 rounded-2xl py-4 px-6 shadow hover:bg-blue-50 transition"
          >
            📋 <span>月別費用一覧</span>
          </Link>
          <Link
            href="/summary"
            className="w-11/12 max-w-xs mx-auto flex items-center justify-center gap-3 bg-white border border-blue-200 text-blue-700 rounded-2xl py-4 px-6 shadow hover:bg-blue-50 transition"
          >
            📊 <span>費用の集計</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
