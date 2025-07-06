import { connectToDB } from "@/lib/db";
import Budget from "@/models/Budget";

export async function GET(req: Request) {
  try {
    await connectToDB();

    // Optional: parse month from query param ?month=YYYY-MM
    const url = new URL(req.url);
    const month = url.searchParams.get("month");

    let budgets;
    if (month) {
      budgets = await Budget.find({ month });
    } else {
      budgets = await Budget.find();
    }

    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch budgets", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.category || !body.month || !body.budgetAmount) {
      return new Response("Missing required fields", { status: 400 });
    }

    await connectToDB();

    // Check if budget for category+month exists
    let budget = await Budget.findOne({ category: body.category, month: body.month });
    if (budget) {
      // Update existing
      budget.budgetAmount = body.budgetAmount;
      await budget.save();
    } else {
      budget = await Budget.create({
        category: body.category,
        month: body.month,
        budgetAmount: body.budgetAmount,
      });
    }

    return new Response(JSON.stringify(budget), { status: 200 });
  } catch (error) {
    return new Response("Failed to save budget", { status: 500 });
  }
}
