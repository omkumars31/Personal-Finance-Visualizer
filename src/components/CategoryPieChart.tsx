
"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6384", "#a4de6c"];

interface Transaction {
  amount: number;
  category?: string;
}

export default function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const data = React.useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((t) => {
      const category = t.category || "Others";
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(t.amount);
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
