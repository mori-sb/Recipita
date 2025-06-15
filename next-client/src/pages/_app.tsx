// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import UserInitializer from "@/components/UserInitializer";
import { Toaster } from "sonner";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Service Worker の登録（副作用）
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("✅ Service Worker registered:", reg);
        })
        .catch((err) => {
          console.error("❌ Service Worker registration failed:", err);
        });
    }
  }, []);

  return (
    <>
      {/* ヘッダーにメタ情報とリンクを追加 */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-owl-smile.png" />
        <meta name="theme-color" content="#1d4ed8" />
      </Head>

      {/* アプリのUI部分 */}
      <UserInitializer />
      <Component {...pageProps} />
      <Toaster richColors position="top-center" />
    </>
  );
}
