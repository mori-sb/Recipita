import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/Footer";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategorySummary } from "@/types/summary";
import { fetchCategorySummaryByUser } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

export default function SummaryPage() {
  const [filterMonth, setFilterMonth] = useState(dayjs().format("YYYY-MM"));
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [amount, setamount] = useState(0);
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

  const months = useMemo(() => {
    const result = [];
    const now = dayjs();
    for (let i = 0; i < 6; i++) {
      const m = now.subtract(i, "month");
      result.push({
        value: m.format("YYYY-MM"),
        label: m.format("YYYY年M月"),
      });
    }
    return result;
  }, []);

  const sortedSummary = useMemo(() => {
    const others = summary.find((s) => s.categoryName === "その他");
    const othersExcluded = summary.filter((s) => s.categoryName !== "その他");
    return [...othersExcluded, ...(others ? [others] : [])];
  }, [summary]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!uid || !apiUrl) return;
      try {
        const data = await fetchCategorySummaryByUser(apiUrl, uid, filterMonth);
        setSummary(data);
        setamount(data.reduce((acc, cur) => acc + cur.amount, 0)); // 🔁 修正
      } catch (e) {
        console.error("カテゴリ集計取得エラー", e);
      }
    };
    loadSummary();
  }, [filterMonth, uid, apiUrl]);

  const topCategory =
    summary.length > 0
      ? summary.reduce((a, b) => (a.amount > b.amount ? a : b)).categoryName
      : null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-blue-300 rounded-lg px-3 py-2 shadow text-sm text-blue-700">
          <div>{payload[0].name}</div>
          <div>¥{payload[0].value.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 px-4 pb-6 max-w-sm mx-auto w-full overflow-x-hidden">
      <div className="max-w-md mx-auto space-y-6 mt-6">
        {/* ヘッダーと月選択 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-800">
            📊 支出 ({filterMonth})
          </h1>
          <Select value={filterMonth} onChange={setFilterMonth}>
            <SelectTrigger className="w-[140px] bg-white border border-blue-300 text-blue-700 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl shadow border border-blue-200 p-4 relative">
          <h2 className="text-base font-semibold text-blue-700 mb-4">
            カテゴリ別支出
          </h2>

          <div className="text-center text-blue-800 font-semibold mb-6">
            今月の合計支出：¥{amount.toLocaleString()}
          </div>

          {/* キャラ＋吹き出し（グラフの中腹に大きめで配置） */}
          <div className="absolute top-24 left-4 z-10 flex items-start space-x-3">
            {/* キャラ大きめ */}
            <div className="w-20 sm:w-24">
              <img
                src="/images/recipita-owl.png"
                alt="キャラクター"
                className="w-full h-auto"
              />
            </div>

            <div className="relative mt-2 bg-white border border-blue-300 text-blue-700 text-xs sm:text-sm rounded-lg px-3 py-2 shadow max-w-[200px] whitespace-normal">
              {topCategory
                ? `${topCategory}にたくさん使ってるね！`
                : "データがないよ〜"}

              {/* 矢印（三角形） */}
              <div
                className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-l border-blue-300"
                style={{ transform: "translateY(-80%) rotate(315deg)" }}
              />
            </div>
          </div>

          <div className="flex justify-center mt-12 mb-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sortedSummary.map((s) => ({
                    name: s.categoryName,
                    value: s.amount,
                  }))}
                  cx="50%"
                  cy="60%"
                  startAngle={90}
                  endAngle={-270}
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {sortedSummary.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* カテゴリごとの一覧（アプリ風） */}
          <div className="space-y-3 mb-6 w-full mt-8">
            {summary.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm w-full"
              >
                <div className="flex items-center gap-6">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.categoryName}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    ¥{item.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
