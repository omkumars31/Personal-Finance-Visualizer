"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Others"];

export default function BudgetForm({ month, onBudgetChange }: { month: string; onBudgetChange: () => void }) {
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBudgets = async () => {
      const res = await axios.get(`/api/budgets?month=${month}`);
      const data = res.data;
      const map: Record<string, number> = {};
      data.forEach((b: any) => (map[b.category] = b.budgetAmount));
      setBudgets(map);
      setInputs(
        Object.fromEntries(
          categories.map((cat) => [cat, map[cat]?.toString() || ""])
        )
      );
    };
    fetchBudgets();
  }, [month]);

  const handleChange = (category: string, value: string) => {
    setInputs((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const category of categories) {
      const amount = Number(inputs[category]);
      if (!isNaN(amount) && amount > 0) {
        await axios.post("/api/budgets", {
          category,
          month,
          budgetAmount: amount,
        });
      }
    }

    onBudgetChange();
    alert("Budgets saved!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Set Monthly Budgets ({month})</h2>
      {categories.map((category) => (
        <div key={category} className="flex justify-between items-center">
          <label>{category}</label>
          <input
            type="number"
            min={0}
            value={inputs[category] || ""}
            onChange={(e) => handleChange(category, e.target.value)}
            className="border px-2 py-1 rounded w-24 text-right"
            placeholder="0"
          />
        </div>
      ))}

      <Button type="submit">Save Budgets</Button>
    </form>
  );
}
