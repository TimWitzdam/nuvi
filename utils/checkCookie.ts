import { Client } from "pg";

export default async function checkCookie(
  req: Request,
  adminCheck: boolean = false
): Promise<
  [userID: string | undefined, cookie: string | undefined, valid: boolean]
> {
  const cookies = req.headers.get("Cookie");
  const cookie = cookies
    ?.split(";")
    .find((c) => c.trim().startsWith("nuvi-auth="))
    ?.split("=")[1];

  if (!cookie) {
    return [undefined, cookie, false];
  }

  const client = new Client();
  await client.connect();

  const tokenCheck = await client.query(
    "SELECT user_id FROM sessions WHERE token = $1 AND create_time > NOW() - INTERVAL '30 days'",
    [cookie]
  );

  if (tokenCheck.rowCount === 0) {
    return [undefined, cookie, false];
  }

  const userID = tokenCheck.rows[0].user_id;

  if (adminCheck) {
    const isAdmin = await client.query(
      `
            SELECT u.role
            FROM "users" u
            LEFT JOIN "roles" r on r.id = u.role
            WHERE u.id = $1
            AND r.name = 'Admin'      
            `,
      [userID]
    );

    if (isAdmin.rowCount === 0) {
      return [userID, cookie, false];
    }
  }

  client.end();

  return [userID, cookie, true];
}
