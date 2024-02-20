import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: Request) {
  const body = await req.json();
  const cookie = body.cookie;

  if (!cookie) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = new Client();
  await client.connect();

  const tokenCheck = await client.query(
    "SELECT user_id FROM sessions WHERE token = $1 AND create_time > NOW() - INTERVAL '30 days'",
    [cookie]
  );

  client.end();

  if (tokenCheck.rowCount !== 1) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Authorized" });
}
