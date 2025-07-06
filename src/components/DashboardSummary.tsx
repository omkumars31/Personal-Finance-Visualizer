"use client";

type Transaction = {
  amount: number;
  date: string;
  category?: string;
};

export default function DashboardSummary({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // Calculate summary from passed transactions prop
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCount = transactions.length;

  const recentDate =
    transactions.length > 0
      ? new Date(
          transactions.reduce((latest, t) =>
            new Date(t.date) > new Date(latest.date) ? t : latest
          ).date
        ).toLocaleDateString()
      : "N/A";

  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    const cat = t.category || "Others";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });
  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded p-4">
        <p className="text-gray-500 text-sm">Total Expenses</p>
        <p className="text-xl font-bold">₹{totalAmount}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <p className="text-gray-500 text-sm">Total Transactions</p>
        <p className="text-xl font-bold">{totalCount}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <p className="text-gray-500 text-sm">Most Recent</p>
        <p className="text-xl font-bold">{recentDate}</p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <p className="text-gray-500 text-sm">Top Category</p>
        <p className="text-xl font-bold">{topCategory}</p>
      </div>
    </div>
  );
}
