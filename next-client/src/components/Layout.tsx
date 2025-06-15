// components/Layout.tsx
import { ReactNode } from "react";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between bg-gradient-to-b from-blue-50 to-white text-gray-900 font-sans flex flex-col relative">
      <main className="flex-grow bg-blue-50 w-full p-6 pt-10">{children}</main>
      <Footer />
    </div>
  );
}
