import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dummyData = [
  {
    id: 1,
    store: "ウェルシア 大田上池台店",
    category: "調剤薬局",
    amount: 1190,
    date: "2025-06-01",
  },
  {
    id: 2,
    store: "セブンイレブン 渋谷店",
    category: "コンビニ",
    amount: 540,
    date: "2025-06-02",
  },
];

interface RecipitaCategory {
  categoryName: string;
  amount: number;
}

interface ReceiptRecord {
  id: number;
  store: string;
  category: string;
  amount: number;
  date: string;
  categories?: RecipitaCategory[]; // ← 追加
}

export default function MonthlyListPage() {
  const [records, setRecords] = useState<ReceiptRecord[]>([]);
  const [selected, setSelected] = useState<ReceiptRecord | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState("2025-06");

  const handleEdit = (record: ReceiptRecord) => {
    setSelected(record);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!selected) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === selected.id ? selected : r))
    );
    setIsOpen(false);
  };

  const filtered = records.filter(
    (r) => r.date && r.date.startsWith(filterMonth)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/receipts");
        if (!res.ok) throw new Error("データ取得に失敗しました");
        const data = await res.json();

        const normalized = data.map((item: any) => ({
          id: item.id,
          store: item.store,
          category: item.categories?.[0]?.categoryName ?? "",
          amount: item.totalAmount,
          date: item.date,
        }));
        setRecords(normalized);
      } catch (error) {
        console.error("取得エラー:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 px-4 pt-2 pb-16 w-full max-w-sm mx-auto">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-blue-700">📒 レシート一覧</h1>
          <Select
            value={filterMonth}
            onValueChange={(value: string) => setFilterMonth(value)}
          >
            <SelectTrigger className="w-[120px] bg-white border border-blue-300 text-blue-600 text-sm h-9">
              <SelectValue />
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
              <Button
                onClick={() => handleEdit(r)}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                編集
              </Button>
              <CardContent className="p-4 space-y-1">
                <div className="text-base font-semibold text-blue-800">
                  {r.store}
                </div>
                <div className="text-sm text-blue-600">
                  カテゴリ: {r.category}
                </div>
                <div className="text-sm text-blue-600">金額: ¥{r.amount}</div>
                <div className="text-xs text-blue-400">{r.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isOpen}>
          <DialogHeader>
            <DialogTitle>
              <span className="text-blue-800">レシート編集</span>
            </DialogTitle>
          </DialogHeader>
          <DialogContent className="w-[90vw] max-w-sm px-4 py-2 mx-auto rounded-md">
            <Input
              value={selected?.store || ""}
              onChange={(e) =>
                setSelected((prev) =>
                  prev ? { ...prev, store: e.target.value } : null
                )
              }
              placeholder="店舗名"
            />
            <Input
              value={selected?.category || ""}
              onChange={(e) =>
                setSelected((prev) =>
                  prev ? { ...prev, category: e.target.value } : null
                )
              }
              placeholder="カテゴリ"
            />
            <Input
              type="number"
              value={selected?.amount ?? ""}
              onChange={(e) =>
                setSelected((prev) =>
                  prev
                    ? { ...prev, amount: parseInt(e.target.value) || 0 }
                    : null
                )
              }
              placeholder="金額"
            />
            <div className="space-y-2 mt-4">
              <div className="font-medium text-blue-700 text-sm">カテゴリ</div>
              {selected?.categories?.map((cat, index) => (
                <div
                  key={index}
                  className="border rounded p-2 space-y-1 bg-blue-50"
                >
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
                  <Button
                    className="text-xs px-2 py-1 mt-1"
                    onClick={() => {
                      const newCats = selected?.categories?.filter(
                        (_, i) => i !== index
                      );
                      setSelected((prev) =>
                        prev ? { ...prev, categories: newCats || [] } : null
                      );
                    }}
                  >
                    削除
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                className="w-full text-sm mt-2 border border-blue-300"
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
          </DialogContent>
          <DialogFooter>
            <Button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              保存
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
