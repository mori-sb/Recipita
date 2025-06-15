"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { initUser } from "@/lib/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export default function UserInitializer() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        (async () => {
          try {
            await initUser(apiUrl);
          } catch (e) {
            console.error(e);
          }
        })();
      }
    });
    return () => unsub();
  }, []);

  return null;
}
