import { NextResponse } from "next/server";
import { Client } from "pg";
import checkCookie from "@/utils/checkCookie";

export async function GET(req: Request) {
  const [userID, cookie, valid] = await checkCookie(req);

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
