// components/ui/select.tsx
import * as React from "react";

export function Select({ value, onChange, children }: any) {
  return (
    <select
      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className }: any) {
  return <div className={`px-2 py-1 rounded ${className}`}>{children}</div>;
}

export function SelectValue({ children }: any) {
  return <span>{children}</span>;
}

export function SelectContent({ children }: any) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: any) {
  return <option value={value}>{children}</option>;
}
