import { NextResponse } from "next/server";
import { Client } from "pg";
import checkCookie from "@/utils/checkCookie";
import bcrypt from "bcrypt";
import { generateSecurePassword } from "@/utils/generatePassword";

export async function POST(req: Request) {
  const [requesterID, cookie, valid] = await checkCookie(req, true);

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const client = new Client();
  await client.connect();

  const password = generateSecurePassword(8);
  const hashedPassword = await bcrypt.hash(password, 10);

  await client.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedPassword,
    id,
  ]);

  await client.end();

  return NextResponse.json({ message: "Password reset", password });
}
