import mongoose, { Schema, models } from "mongoose";

const TransactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date, 
    required: true,
  },
  category: {
    type: String,
    default: "Others",
  },
});


const Transaction = models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;
