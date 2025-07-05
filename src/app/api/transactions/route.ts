import { connectToDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

// GET: Fetch all transactions
export async function GET() {
  try {
    console.log("🌐 [GET] Connecting to DB...");
    await connectToDB();

    console.log("📦 [GET] Fetching transactions...");
    const transactions = await Transaction.find().sort({ date: -1 });

    console.log(`✅ [GET] Fetched ${transactions.length} transactions`);
    return Response.json(transactions);
  } catch (error) {
    console.error("❌ [GET] /api/transactions error:", error);
    return new Response("Failed to fetch transactions", { status: 500 });
  }
}

// POST: Add a new transaction
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.amount || !body.date) {
      console.warn("⚠️ [POST] Missing amount or date:", body);
      return new Response("Missing required fields: amount, date", { status: 400 });
    }

    await connectToDB();

    const transaction = await Transaction.create({
      amount: body.amount,
      date: new Date(body.date),
      description: body.description || "",
      category: body.category || "Others",
    });

    console.log("✅ [POST] Created transaction:", transaction);
    return Response.json(transaction);
  } catch (error) {
    console.error("❌ [POST] /api/transactions error:", error);
    return new Response("Failed to create transaction", { status: 500 });
  }
}
