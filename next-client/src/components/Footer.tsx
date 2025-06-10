import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();
  const current = router.pathname;

  const navItems = [
    { href: "/", label: "ホーム", icon: "🏠" },
    { href: "/ocr", label: "OCR", icon: "📷" },
    { href: "/list", label: "一覧", icon: "📋" },
    { href: "/summary", label: "集計", icon: "📊" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-transparent shadow-md z-50">
      <div className="max-w-sm mx-auto bg-white border-t border-gray-200 flex h-full">
        {navItems.map((item) => {
          const isActive = current === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-xs ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-500"
              } hover:text-blue-500 transition`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
