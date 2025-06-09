import { HiHome, HiCamera, HiViewList } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";

export default function BottomNav() {
  const router = useRouter();
  const current = router.pathname;

  const navItems = [
    { href: "/", icon: HiHome, label: "ホーム" },
    { href: "/ocr", icon: HiCamera, label: "OCR" },
    { href: "/list", icon: HiViewList, label: "一覧" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50 flex justify-around py-3 px-4">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-sm font-medium transition ${
            current === href
              ? "text-blue-600"
              : "text-gray-400 hover:text-blue-500"
          }`}
        >
          <Icon className="w-6 h-6 mb-1" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
