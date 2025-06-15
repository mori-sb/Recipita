// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import UserInitializer from "@/components/UserInitializer";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserInitializer />
      <Component {...pageProps} />;
      <Toaster richColors position="top-center" />
    </>
  );
}
