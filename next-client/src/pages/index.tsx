import Layout from "@/components/Layout";
import { HiCamera, HiClipboardList, HiChartPie } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image"; // ← 追加！

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-blue-50 text-gray-900 px-4 pt-16 pb-24 max-w-sm mx-auto w-full flex flex-col items-center text-center mt-5">
        <h1 className="text-3xl font-bold text-blue-600">Recipita</h1>
        <p className="text-gray-600">レシートでかんたん家計簿</p>

        {/* キャラクター画像の追加 */}
        <div className="relative w-60 h-48 mt-10">
          <Image
            src="/images/recipita-owl.png"
            alt="Recipitaキャラクター"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full border border-green-300 shadow inline-block">
          🏅 初心者節約マスター
        </div>

        <div className="w-full space-y-4 mt-16">
          <Link
            href="/ocr"
            className="w-11/12 max-w-xs mx-auto flex items-center justify-center gap-3 bg-blue-500 text-white rounded-2xl py-4 px-6 shadow-lg hover:bg-blue-600 transition"
          >
            📷 <span>レシートを読み取り</span>
          </Link>
          <Link
            href="/list"
            className="w-11/12 max-w-xs mx-auto flex items-center justify-center gap-3 bg-white border border-blue-200 text-blue-700 rounded-2xl py-4 px-6 shadow hover:bg-blue-50 transition"
          >
            📋 <span>月別費用一覧</span>
          </Link>
          <Link
            href="/summary"
            className="w-11/12 max-w-xs mx-auto flex items-center justify-center gap-3 bg-white border border-blue-200 text-blue-700 rounded-2xl py-4 px-6 shadow hover:bg-blue-50 transition"
          >
            📊 <span>費用の集計</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
