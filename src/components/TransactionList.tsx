"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function TransactionList(){

    const [transactions, setTransactions] = useState<any[]>([]);

    const fetchData = async() =>{
        const res = await axios.get("/api/transactions");
        setTransactions(res.data);
    };

    useEffect(() =>{
        fetchData();

    },[]);

    const deleteTransaction = async (id: string) =>{
        await axios.delete(`/api/transactions/${id}`);
        fetchData();

    };
     return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <Card key={t._id} className="p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold">₹{t.amount}</div>
            <div className="text-sm text-muted-foreground">{t.description}</div>
            <div className="text-xs">{new Date(t.date).toDateString()}</div>
          </div>
          <Button variant="destructive" onClick={() => deleteTransaction(t._id)}>
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
}