"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  amount: number;
  date: string;
}

export default function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  // Transform transactions into monthly aggregated data
  const monthlyData = React.useMemo(() => {
    const monthly: Record<string, number> = {};

    transactions.forEach((t) => {
      if (!t.date || !t.amount) return;
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthly[month] = (monthly[month] || 0) + t.amount;
    });

    return Object.entries(monthly).map(([month, amount]) => ({ month, amount }));
  }, [transactions]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
