"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Others"];

type Transaction = {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

type Props = {
  onAdd?: () => void;
  transaction?: Transaction;
  onCancel?: () => void;
  onSave?: () => void;
};

export default function TransactionForm({ onAdd, transaction, onCancel, onSave }: Props) {
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [description, setDescription] = useState(transaction?.description || "");
  const [date, setDate] = useState(transaction?.date || "");
  const [category, setCategory] = useState(transaction?.category || "Others");

  const isEditMode = Boolean(transaction);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setDate(transaction.date);
      setCategory(transaction.category);
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date || !category) return;

    try {
      if (isEditMode) {
        await axios.put(`/api/transactions/${transaction!._id}`, {
          amount: +amount,
          description,
          date,
          category,
        });
        if (onSave) onSave();
      } else {
        await axios.post("/api/transactions", {
          amount: +amount,
          description,
          date,
          category,
        });
        if (onAdd) onAdd();
        // Reset form only on add
        setAmount("");
        setDescription("");
        setDate("");
        setCategory("Others");
      }
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="flex space-x-2">
        <Button type="submit">{isEditMode ? "Save Changes" : "Add Transaction"}</Button>
        {isEditMode && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
