"use client";
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import TransactionForm from "./TransactionForm";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
};

export default function TransactionList({
  transactions,
  onDeleteSuccess,
  onEditSuccess,
}: {
  transactions: Transaction[];
  onDeleteSuccess: () => void;
  onEditSuccess: () => void;
}) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="space-y-2">
      {editingTransaction ? (
        <TransactionForm
  transaction={{ ...editingTransaction, category: editingTransaction.category || "Others" }}
  onCancel={() => setEditingTransaction(null)}
  onSave={() => {
    setEditingTransaction(null);
    onEditSuccess();
  }}
/>

      ) : (
        transactions.map((t) => (
          <Card key={t._id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">₹{t.amount}</div>
              <div className="text-sm text-muted-foreground">{t.description}</div>
              <div className="text-xs">
                {new Date(t.date).toDateString()} • {t.category || "Others"}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setEditingTransaction(t)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteTransaction(t._id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
