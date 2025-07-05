import { connectToDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function DELETE(req: Request, { params }: { params: {id: string }}){
    await connectToDB();
    await Transaction.findByIdAndDelete(params.id);
    return Response.json({ message: "Deleted" });
}