import { getDb } from "@/lib/db";

export async function generateMemberId() {
  const db = await getDb();

  const counter = await db.collection("counters").findOneAndUpdate(
    {
      _id: "member",
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  const seq = counter.sequence;

  const year = new Date().getFullYear();

  const padded = String(seq).padStart(6, "0");

  return {
    memberId: `MKDS-MEM-${padded}`,

    receiptNumber: `MKDS/M/${year}/${padded}`,

    sequence: seq,
  };
}
