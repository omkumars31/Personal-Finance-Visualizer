"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Others"];

type BudgetData = { category: string; budgetAmount: number };
type Transaction = { category: string; amount: number; date: string };

export default function BudgetComparisonChart({ month }: { month: string }) {
  const [data, setData] = useState<
    { category: string; budget: number; actual: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const [budgetRes, transRes] = await Promise.all([
        axios.get(`/api/budgets?month=${month}`),
        axios.get("/api/transactions"),
      ]);

      const budgets: BudgetData[] = budgetRes.data;
      const transactions: Transaction[] = transRes.data;

      // Filter transactions of the month
      const filteredTrans = transactions.filter((t) =>
        t.date.startsWith(month)
      );

      // Calculate actual spending per category
      const actuals: Record<string, number> = {};
      filteredTrans.forEach((t) => {
        const cat = t.category || "Others";
        actuals[cat] = (actuals[cat] || 0) + t.amount;
      });

      // Map budgets & actuals for all categories
      const chartData = categories.map((cat) => {
        const budget = budgets.find((b) => b.category === cat)?.budgetAmount || 0;
        const actual = actuals[cat] || 0;
        return { category: cat, budget, actual };
      });

      setData(chartData);
    };

    fetchData();
  }, [month]);

  return (
    <div className="w-full h-[300px] bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Budget vs Actual - {month}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual" fill="#8884d8" name="Actual Spending" />
          <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
