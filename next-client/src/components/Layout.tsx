// components/Layout.tsx
import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 font-sans flex flex-col relative">
      <Header />
      <main className="flex-grow bg-blue-50 w-full p-6 pb-16">{children}</main>
      <Footer />
    </div>
  );
}
