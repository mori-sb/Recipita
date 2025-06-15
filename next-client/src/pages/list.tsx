"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { updateReceipt } from "@/lib/api";
import { fetchReceiptsByUser } from "@/lib/api";
import { deleteReceipt } from "@/lib/api";

interface RecipitaCategory {
  categoryName: string;
  amount: number;
}

interface ReceiptRecord {
  id: number;
  store: string;
  category?: string;
  totalAmount: number;
  date: string;
  categories?: RecipitaCategory[];
}

export default function MonthlyListPage() {
  const [records, setRecords] = useState<ReceiptRecord[]>([]);
  const [selected, setSelected] = useState<ReceiptRecord | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState("2025-06");
  const [uid, setUid] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!uid || !auth.currentUser) return;
      try {
        const data = await fetchReceiptsByUser(apiUrl, uid);

        const normalized = data.map((item: any) => ({
          id: item.id,
          store: item.store,
          totalAmount: item.totalAmount,
          date: item.date,
          categories: item.categories || [],
        }));

        setRecords(normalized);
      } catch (error) {
        console.error("取得エラー:", error);
      }
    };

    fetchData();
  }, [uid]);

  const handleEdit = (record: ReceiptRecord) => {
    setSelected(record);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!selected || !auth.currentUser) return;
    try {
      await updateReceipt(apiUrl, selected);
      setRecords((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...selected } : r))
      );

      // モーダルを閉じる前に selected を null にして状態を確実にリセット
      setSelected(null);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOpen(false);
      setSelected(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このレシートを削除してもよろしいですか？")) return;
    try {
      await deleteReceipt(apiUrl, id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
    }
  };

  const filtered = records.filter(
    (r) => r.date && r.date.startsWith(filterMonth)
  );

  return (
    <div className="min-h-screen overflow-auto bg-blue-50 text-gray-900 px-4 pt-2 pb-16 w-full max-w-sm mx-auto">
      {isOpen && <div className="fixed inset-0 bg-black/40 z-50"></div>}

      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-blue-700">📒 レシート一覧</h1>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[120px] bg-white border border-blue-300 text-blue-600 text-sm h-9">
              <SelectValue placeholder="月を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-06">2025年6月</SelectItem>
              <SelectItem value="2025-05">2025年5月</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filtered.map((r) => (
            <Card
              key={r.id}
              className="relative w-full rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition"
            >
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                  onClick={() => handleEdit(r)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                  aria-label="編集"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                  aria-label="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <CardContent className="p-4 space-y-1">
                <div className="text-base font-semibold text-blue-800">
                  {r.store}
                </div>
                <div className="text-sm text-blue-600">
                  カテゴリ:{" "}
                  {r.categories && r.categories.length > 0
                    ? r.categories.map((cat) => cat.categoryName).join(", ")
                    : "なし"}
                </div>
                <div className="text-sm text-blue-600">
                  金額: ¥{r.totalAmount}
                </div>
                <div className="text-xs text-blue-400">{r.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isOpen}>
          <DialogContent className="w-[95%] max-w-sm max-h-[80vh] overflow-y-auto px-4 py-6 rounded-xl bg-white space-y-4">
            <div className="text-blue-800 text-lg font-bold">レシート編集</div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
              aria-label="閉じる"
              type="button"
              style={{ lineHeight: "1" }}
            >
              ×
            </button>

            {/* フォーム入力欄 */}
            <div className="space-y-3">
              <Input
                className="w-full"
                value={selected?.store || ""}
                onChange={(e) =>
                  setSelected((prev) =>
                    prev ? { ...prev, store: e.target.value } : null
                  )
                }
                placeholder="店舗名"
              />
              <Input
                type="number"
                className="w-full"
                value={
                  selected?.totalAmount === 0
                    ? ""
                    : (selected?.totalAmount ?? "")
                }
                onChange={(e) =>
                  setSelected((prev) =>
                    prev
                      ? { ...prev, totalAmount: parseInt(e.target.value) || 0 }
                      : null
                  )
                }
                placeholder="金額"
              />
            </div>

            {/* カテゴリ */}
            <div className="space-y-2">
              {selected?.categories?.map((cat, index) => (
                <div
                  key={index}
                  className="relative border rounded p-3 bg-blue-50"
                >
                  <div className="text-blue-700 text-sm font-semibold mb-3">
                    カテゴリ
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={cat.categoryName}
                      onChange={(e) => {
                        const newCats = [...(selected.categories || [])];
                        newCats[index].categoryName = e.target.value;
                        setSelected((prev) =>
                          prev ? { ...prev, categories: newCats } : null
                        );
                      }}
                      placeholder="カテゴリ名"
                    />
                    <Input
                      type="number"
                      value={cat.amount}
                      onChange={(e) => {
                        const newCats = [...(selected.categories || [])];
                        newCats[index].amount = parseInt(e.target.value) || 0;
                        setSelected((prev) =>
                          prev ? { ...prev, categories: newCats } : null
                        );
                      }}
                      placeholder="金額"
                    />
                  </div>
                  <Button
                    className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-600"
                    onClick={() => {
                      const newCats = selected?.categories?.filter(
                        (_, i) => i !== index
                      );
                      setSelected((prev) =>
                        prev ? { ...prev, categories: newCats || [] } : null
                      );
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                className="w-full text-sm mt-3 border border-blue-300"
                onClick={() =>
                  setSelected((prev) =>
                    prev
                      ? {
                          ...prev,
                          categories: [
                            ...(prev.categories || []),
                            { categoryName: "", amount: 0 },
                          ],
                        }
                      : null
                  )
                }
              >
                + カテゴリ追加
              </Button>
            </div>

            {/* フッター */}
            <div className="z-60">
              <DialogFooter>
                <Button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  保存
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="fixed bottom-0 w-full z-40">
        <Footer />
      </div>
    </div>
  );
}
