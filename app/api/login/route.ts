import { Client } from "pg";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }

  const client = new Client();
  await client.connect();

  const res = await client.query(
    "SELECT id, name, password FROM users WHERE username = $1",
    [username]
  );

  if (res.rowCount === 0) {
    await client.end();
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const user = res.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    await client.end();
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  const sessionToken = crypto.randomUUID();

  await client.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [
    user.id,
    sessionToken,
  ]);

  await client.end();

  return NextResponse.json({ token: sessionToken });
}
