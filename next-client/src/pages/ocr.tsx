"use client";

import { useState, useEffect, useRef } from "react";
import { HiCamera } from "react-icons/hi";
import Footer from "@/components/Footer";
import { FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import LoadingScreen from "./LoadingScreen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";

export default function OcrPage() {
  const [store, setStore] = useState("");
  const [uid, setUid] = useState<String | null>(null);
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<
    { id: string; name: string; amount: number }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // --- ロード画面の表示/非表示を管理するstateを追加 ---
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRegister = async () => {
    try {
      if (!auth.currentUser) return;

      const idToken = await getIdToken(auth.currentUser);
      console.log("idToken", idToken);
      const response = await fetch(`${apiUrl}/api/receipts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          store: store,
          totalAmount: parseInt(price || "0", 10),
          date: new Date().toISOString().split("T")[0],
          categories: categories.map(({ name, amount }) => ({
            categoryName: name,
            amount: amount,
          })),
        }),
      });

      if (!response.ok) throw new Error("登録に失敗しました");

      console.log("レシートを登録しました！"); // alert()をconsole.logに変更
      // オプションでフォームリセット
      setStore("");
      setPrice("");
      setCategories([]);
      setImageFile(null);
    } catch (error) {
      console.error("登録エラー:", error);
      console.log("レシートの登録に失敗しました"); // alert()をconsole.logに変更
    }
  };

  const handleExtract = async () => {
    if (!imageFile) return;

    setLoading(true); // --- 読み取り開始時にロード画面を表示 ---

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      try {
        const res = await fetch(`${apiUrl}/api/gemini-ocr`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64Image: base64String }),
        });
        if (!res.ok) throw new Error("OCR API error");
        const text = await res.text();
        const parsed = parseResponse(text);
        console.log("parsed:", parsed);
        setStore(parsed.store);
        setPrice(parsed.price);
        setCategories(parsed.categories);
        setImageFile(null); // 読み取り後、選択ファイルをクリア

        console.log("レシートの読み取りが完了しました。"); // alert()をconsole.logに変更
      } catch (err) {
        console.error("読み取り失敗:", err);
        console.log("読み取りに失敗しました"); // alert()をconsole.logに変更
      } finally {
        setLoading(false); // --- 読み取り終了時にロード画面を非表示 ---
      }
    };
    reader.readAsDataURL(imageFile);
  };

  const parseResponse = (text: string) => {
    const parsed = JSON.parse(text);

    return {
      store: parsed.store || "",
      price: parsed.totalAmount?.toString() || "0",
      categories: (parsed.categories || []).map((c: any) => ({
        id: uuid(),
        name: c.categoryName,
        amount: c.amount,
      })),
    };
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { id: uuid(), name: "", amount: 0 }]);
  };

  const deleteCategory = (idToDelete: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== idToDelete));
  };

  useEffect(() => {
    // ページロード時の初期化処理
    setStore("");
    setPrice("");
    setCategories([]);
    setImageFile(null);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-blue-50 text-gray-800 px-4 pt-2 pb-16 max-w-sm mx-auto w-full overflow-x-hidden">
        <main className="flex-grow px-4 py-1 max-w-sm mx-auto w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-blue-100">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
                <HiCamera className="w-6 h-6" />
                レシート読み取り
              </h1>
              <p className="text-sm text-gray-600">
                レシートの写真を撮って読み取ろう。
              </p>
            </div>

            <div className="flex items-center gap-0 justify-start">
              {/* キャラ画像（少し大きめ & 明示的な幅） */}
              <div className="w-24 h-24 relative flex-shrink-0">
                <img
                  src="/images/recipita-owl.png"
                  alt="キャラクター"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative bg-white border border-blue-300 text-blue-700 text-sm rounded-lg px-4 py-2 shadow max-w-[200px] whitespace-normal">
                今日のレシートを登録してみよう！
                <div
                  className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-l border-blue-300"
                  style={{ transform: "translateY(-80%) rotate(315deg)" }}
                />
              </div>
            </div>

            <label
              htmlFor="imageUpload"
              className="block bg-blue-50 border-2 border-blue-400 border-dashed rounded-lg py-4 text-center text-blue-600 cursor-pointer hover:bg-blue-100 transition"
            >
              📷 写真を撮る / 画像を選ぶ
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            {imageFile && (
              <p className="text-sm text-blue-700 text-center mt-2">
                選択済み：{imageFile.name}
              </p>
            )}

            <button
              onClick={handleExtract}
              disabled={!imageFile || loading} // --- ロード中はボタンを無効化 ---
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                imageFile && !loading // --- ロード中はボタンのスタイルも無効化 ---
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-200 cursor-not-allowed"
              }`}
            >
              {loading ? "読み取り中..." : "読み取る"}{" "}
              {/* --- ボタンのテキストも変更 --- */}
            </button>

            <div className="bg-blue-50 rounded-xl p-4 space-y-4">
              <h2 className="text-blue-700 font-semibold text-base">
                🧾 抽出結果
              </h2>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">店舗名</label>
                <input
                  type="text"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  placeholder="例: ウェルシア"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-600">金額 (¥)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="例: 2580"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <label className="text-sm text-gray-600 block mb-0">
                カテゴリ
              </label>
              <div className="space-y-2">
                {categories.map(({ id, name, amount }) => (
                  <div
                    key={id}
                    className="bg-white border border-blue-200 rounded-lg px-4 pt-2 pb-4 shadow-sm relative"
                  >
                    {/* 削除ボタン */}
                    <button
                      onClick={() => deleteCategory(id)}
                      className="absolute top-2 right-2 text-red-300 hover:text-red-500"
                      aria-label="カテゴリ削除"
                    >
                      <FaTrash />
                    </button>

                    {/* カテゴリ名 */}
                    <div>
                      <label className="text-sm text-gray-600 mb-4">
                        カテゴリ名
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setCategories((prev) =>
                            prev.map((item) =>
                              item.id === id ? { ...item, name: newName } : item
                            )
                          );
                        }}
                        placeholder="例: 食費"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* 金額 */}
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600">金額 (¥)</label>
                      <input
                        type="number"
                        value={amount === 0 ? "" : amount}
                        onChange={(e) => {
                          const newAmount = parseInt(e.target.value || "0", 10);
                          setCategories((prev) =>
                            prev.map((item) =>
                              item.id === id
                                ? { ...item, amount: newAmount }
                                : item
                            )
                          );
                        }}
                        placeholder="例: 500"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCategory}
                  className="w-full py-2 mt-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                >
                  + カテゴリを追加
                </button>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 transition"
            >
              登録する
            </button>
          </div>
        </main>
        <Footer />
      </div>
      {/* --- ロード画面コンポーネントを最上位に配置 --- */}
      <LoadingScreen isLoading={loading} />
    </>
  );
}
