"use client";
import { use, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

export default function TransactionForm({ onAdd }: { onAdd: () => void }){
    const [amount, setAmount] = useState("");
    const [description , setDescription] = useState("");
    const [date, setDate] = useState("");


    const handleSubmit = async(e : React.FormEvent) =>{
        e.preventDefault();
        if(!amount || !description || !date) return;
        await axios.post("/api/transactions", {
            amount: +amount,
            description,
            date,
        });
        setAmount("");
        setDescription("");
        setDate("");
        onAdd();
    }
    return(
        <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Button type="submit">Add Transaction</Button>
    </form>
    )
}