import { connectToDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connectToDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return Response.json(transactions);
  } catch (error) {
    return new Response("Failed to fetch transactions", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.amount || !body.date) {
      return new Response("Missing required fields: amount, date", { status: 400 });
    }

    await connectToDB();

    const transaction = await Transaction.create({
      amount: body.amount,
      date: new Date(body.date),
      description: body.description || "",
      category: body.category || "Others",
    });

    return Response.json(transaction);
  } catch (error) {
    return new Response("Failed to create transaction", { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    if (!body.amount || !body.date) {
      return new Response("Missing required fields: amount, date", { status: 400 });
    }

    await connectToDB();

    const updated = await Transaction.findByIdAndUpdate(
      id,
      {
        amount: body.amount,
        date: new Date(body.date),
        description: body.description || "",
        category: body.category || "Others",
      },
      { new: true }
    );

    if (!updated) {
      return new Response("Transaction not found", { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    return new Response("Failed to update transaction", { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;
    await connectToDB();
    await Transaction.findByIdAndDelete(id);
    return new Response("Transaction deleted", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete transaction", { status: 500 });
  }
}
