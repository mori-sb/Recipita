"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { initUser } from "@/lib/initUser";

export default function UserInitializer() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        initUser();
      }
    });
    return () => unsub();
  }, []);

  return null;
}
