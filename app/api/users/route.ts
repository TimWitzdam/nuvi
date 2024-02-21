import { NextResponse } from "next/server";
import { Client } from "pg";
import checkCookie from "@/utils/checkCookie";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  const [userID, cookie, valid] = await checkCookie(req, true);

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = new Client();
  await client.connect();

  const users = await client.query(
    `
        SELECT u.id, u.name, r.name as role 
        FROM users u
        LEFT JOIN roles r on u.role = r.id
        `
  );

  client.end();

  const loggedInAs = users.rows.find((user) => user.id === userID);
  const allUsers = users.rows.filter((user) => user.id !== userID);

  return NextResponse.json({ loggedInAs, allUsers });
}

export async function POST(req: Request) {
  const [userID, cookie, valid] = await checkCookie(req, true);

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, userName, role, password } = await req.json();

  if (!name || !userName || !role || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const client = new Client();
  await client.connect();

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = await client.query(
    `
    INSERT INTO "users" (name, username, password, role)
    VALUES ($1, $2, $3, (
                                        SELECT id FROM roles WHERE name = $4 LIMIT 1
                                     )
           )
    RETURNING id
        `,
    [name, userName, encryptedPassword, role]
  );

  client.end();

  return NextResponse.json({ message: "User added", id: newUser.rows[0].id });
}
