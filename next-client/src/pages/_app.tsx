// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import UserInitializer from "@/components/UserInitializer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserInitializer />
      <Component {...pageProps} />;
    </>
  );
}
