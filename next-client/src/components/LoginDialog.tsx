"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginTriggerButton() {
  const [open, setOpen] = useState(false);

  const handleGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    setOpen(false);
  };

  const handleGuest = async () => {
    await signInAnonymously(auth);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        ログイン
      </button>

      <Dialog open={open}>
        <DialogContent className="max-w-sm text-center space-y-4">
          <DialogHeader>
            <DialogTitle>ログイン方法を選択</DialogTitle>
          </DialogHeader>
          <button
            onClick={handleGoogle}
            className="w-full bg-blue-100 text-blue-800 py-2 rounded hover:bg-blue-200"
          >
            Googleでログイン
          </button>
          <button
            onClick={handleGuest}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
          >
            ゲストとして使う
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full text-sm text-gray-500 underline"
          >
            キャンセル
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
