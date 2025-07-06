"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Others"];

export default function SpendingInsights({ month }: { month: string }) {
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [budgetRes, transRes] = await Promise.all([
        axios.get(`/api/budgets?month=${month}`),
        axios.get("/api/transactions"),
      ]);

      const budgets = budgetRes.data;
      const transactions = transRes.data;

      // Filter transactions of the month
      const filteredTrans = transactions.filter((t: any) => t.date.startsWith(month));

      // Calculate actual spending per category
      const actuals: Record<string, number> = {};
      filteredTrans.forEach((t: any) => {
        const cat = t.category || "Others";
        actuals[cat] = (actuals[cat] || 0) + t.amount;
      });

      // Generate insights
      const newInsights: string[] = [];

      categories.forEach((cat) => {
        const budget = budgets.find((b: any) => b.category === cat)?.budgetAmount || 0;
        const actual = actuals[cat] || 0;

        if (budget === 0) return; // skip if no budget

        const percent = (actual / budget) * 100;

        if (percent >= 100) {
          newInsights.push(`You exceeded your ${cat} budget by ${Math.round(percent - 100)}%.`);
        } else if (percent >= 80) {
          newInsights.push(`You have spent ${Math.round(percent)}% of your ${cat} budget.`);
        }
      });

      setInsights(newInsights);
    };

    fetchData();
  }, [month]);

  if (insights.length === 0) {
    return <p className="text-gray-500">No spending insights for this month.</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <h2 className="text-lg font-semibold mb-2">Spending Insights</h2>
      <ul className="list-disc list-inside">
        {insights.map((insight, i) => (
          <li key={i}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}
