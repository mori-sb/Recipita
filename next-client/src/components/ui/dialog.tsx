import React from "react";

export function Dialog({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
      {/* 背景オーバーレイ */}
      <div className="fixed inset-0 bg-black/40 z-40" />

      {/* モーダル本体 */}
      <div className="relative z-50 w-full max-w-xs bg-white rounded-lg shadow-lg p-4">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 text-xl font-semibold">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-blue-800 text-lg font-bold">{children}</h2>;
}

export function DialogContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-right">{children}</div>;
}
