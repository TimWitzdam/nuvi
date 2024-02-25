import { NextResponse } from "next/server";
import { Client } from "pg";
import checkCookie from "@/utils/checkCookie";

export async function GET(req: Request) {
  const [userID, cookie, valid] = await checkCookie(req, true);

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = new Client();
  await client.connect();

  const todoLists = await client.query(
    `
    SELECT l.id, l.name, COUNT(t.id) AS open_tasks
    FROM "todoLists" l
    LEFT JOIN public."todoListUserRoles" lur on l.id = lur.list_id
    LEFT JOIN public."todoListAccesses" la on l.id = la.list_id
    LEFT JOIN public."todoTasks" t on l.id = t.list AND t.open = true
    WHERE lur.user_id = $1
    GROUP BY l.name, l.id, la.access_time
    ORDER BY la.access_time DESC
    `,
    [userID]
  );

  client.end();

  return NextResponse.json(todoLists.rows);
}

export async function POST(req: Request) {
  const [userID, cookie, valid] = await checkCookie(req, true);

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, users } = await req.json();

  if (!name || !users || users.length === 0) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const client = new Client();
  await client.connect();

  const newList = await client.query(
    `
    INSERT INTO "todoLists" (name)
    VALUES ($1)
    RETURNING id
    `,
    [name]
  );

  await client.query(
    `
    INSERT INTO "todoListUserRoles" (list_id, user_id, role_id)
    VALUES ($1, $2, (
                                        SELECT id FROM "todoListRoles" WHERE name = 'Owner' LIMIT 1
                                    )
          )
    `,
    [newList.rows[0].id, userID]
  );

  const filteredUsers = users.filter(
    (user: { id: string; name: string; role: string }) => user.id !== userID
  );

  for (const user of filteredUsers) {
    await client.query(
      `
        INSERT INTO "todoListUserRoles" (list_id, user_id, role_id)
        VALUES ($1, $2, (
                                              SELECT id FROM "todoListRoles" WHERE name = 'Collaborator' LIMIT 1
                                          )
              )
        `,
      [newList.rows[0].id, user.id]
    );
  }

  await client.query(
    `
    INSERT INTO "todoListAccesses" (user_id, list_id)
    VALUES ($1, $2)
    `,
    [userID, newList.rows[0].id]
  );

  client.end();

  return NextResponse.json({
    message: "List created",
    id: newList.rows[0].id,
    userID,
  });
}
