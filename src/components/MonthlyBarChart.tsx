"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

export default function MonthlyBarChart() {
  const [data, setData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/transactions");
        const transactions: Transaction[] = res.data;

        const monthly: Record<string, number> = {};

        transactions.forEach((t) => {
          if (!t.date || !t.amount) return;
          const month = new Date(t.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          monthly[month] = (monthly[month] || 0) + t.amount;
        });

        const formatted = Object.entries(monthly).map(([month, amount]) => ({
          month,
          amount,
        }));

        setData(formatted);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
