// components/Layout.tsx
import { ReactNode } from "react";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 font-sans flex flex-col">
      <main className="flex-grow w-full max-w-md mx-auto p-6 pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
