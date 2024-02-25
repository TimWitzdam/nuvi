import { NextResponse } from "next/server";
import { Client } from "pg";
import checkCookie from "@/utils/checkCookie";

export async function GET(
  req: Request,
  { params }: { params: { listID: string } }
) {
  const [userID, cookie, valid] = await checkCookie(req);

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const listID = params.listID;

  const client = new Client();
  await client.connect();

  const accessCheck = await client.query(
    `
        SELECT * FROM "todoListUserRoles" WHERE list_id = $1 AND user_id = $2
        `,
    [listID, userID]
  );

  if (accessCheck.rows.length === 0) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tasks = await client.query(
    `
        SELECT "id", "content", "order"
        FROM "todoTasks"
        WHERE "list" = $1
        AND "open" IS TRUE
        ORDER BY "order" DESC
        `,
    [listID]
  );

  client.end();

  for (const task of tasks.rows) {
    task.open = true;
  }

  return NextResponse.json({ tasks: tasks.rows, userID });
}
