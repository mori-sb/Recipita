import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/Footer";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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
  {
    id: 3,
    store: "スターバックス 銀座店",
    category: "カフェ",
    amount: 680,
    date: "2025-06-05",
  },
  {
    id: 4,
    store: "ローソン 中野坂上店",
    category: "コンビニ",
    amount: 320,
    date: "2025-05-25",
  },
  {
    id: 5,
    store: "マクドナルド 池袋店",
    category: "ファストフード",
    amount: 790,
    date: "2025-05-29",
  },
];

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

export default function SummaryPage() {
  const [filterMonth, setFilterMonth] = useState("2025-06");
  const filtered = dummyData.filter((r) => r.date.startsWith(filterMonth));
  const renderLabel = (entry: any) => entry.name;

  const categories: Record<string, number> = {};
  filtered.forEach(({ category, amount }) => {
    categories[category] = (categories[category] || 0) + amount;
  });

  const pieData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));
  const totalAmount = Object.values(categories).reduce(
    (sum, val) => sum + val,
    0
  );

  const summaryByCategory = filtered.reduce(
    (acc, curr) => {
      const cat = curr.category;
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const chartData = Object.entries(summaryByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const topCategory =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.value > b.value ? a : b)).name
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
    <div className="min-h-screen bg-blue-50 text-gray-800 px-4 pt-2 pb-6 max-w-sm mx-auto w-full overflow-x-hidden">
      <div className="max-w-md mx-auto space-y-6 mt-6">
        {/* ヘッダーと月選択 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-800">
            📊 支出 ({filterMonth})
          </h1>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[140px] bg-white border border-blue-300 text-blue-700 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-06">2025年6月</SelectItem>
              <SelectItem value="2025-05">2025年5月</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl shadow border border-blue-200 p-4 relative">
          <h2 className="text-base font-semibold text-blue-700 mb-4">
            カテゴリ別支出
          </h2>

          <div className="text-center text-blue-800 font-semibold mb-6">
            今月の合計支出：¥{totalAmount.toLocaleString()}
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

          <div className="flex justify-center mt-12 mb-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="60%"
                  startAngle={90}
                  endAngle={-270}
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {pieData.map((entry, index) => (
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
          <div className="space-y-3 mb-6 w-full">
            {pieData.map(({ name, value }, index) => {
              const percent = ((value / totalAmount) * 100).toFixed(1);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm w-full"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      ¥{value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{percent}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
