"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";

import BudgetForm from "@/components/BudgetForm";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import SpendingInsights from "@/components/SpendingInsights";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-10 space-y-8 px-4">
      <h1 className="text-3xl font-bold text-center"> Personal Finance Tracker</h1>

      <DashboardSummary transactions={transactions} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyBarChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>

      <TransactionForm onAdd={fetchData} />
      <TransactionList
        transactions={transactions}
        onDeleteSuccess={fetchData}
        onEditSuccess={fetchData}
      />

      <BudgetForm month={currentMonth} onBudgetChange={fetchData} />

      <BudgetComparisonChart month={currentMonth} />

      <SpendingInsights month={currentMonth} />
    </main>
  );
}
