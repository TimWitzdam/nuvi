import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(req: Request) {
  const cookies = req.headers.get("Cookie");
  const cookie = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("nuvi-auth="))
    ?.split("=")[1];

  if (!cookie) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = new Client();
  await client.connect();

  const tokenCheck = await client.query(
    "SELECT user_id FROM sessions WHERE token = $1 AND create_time > NOW() - INTERVAL '30 days'",
    [cookie]
  );

  if (tokenCheck.rowCount === 0) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const todoLists = await client.query(
    `
    SELECT l.id, l.name, COUNT(t.id) AS open_tasks
    FROM "todoLists" l
    LEFT JOIN public."todoListUserRoles" lur on l.id = lur.list_id
    LEFT JOIN public."todoListAccesses" la on l.id = la.list_id
    LEFT JOIN public."todoTasks" t on l.id = t.list
    WHERE lur.user_id = $1
    AND t.open = true
    GROUP BY l.name, l.id, la.access_time
    ORDER BY la.access_time DESC
    `,
    [tokenCheck.rows[0].user_id]
  );

  client.end();

  return NextResponse.json(todoLists.rows);
}
