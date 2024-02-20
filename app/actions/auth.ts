"use server";

import { Client } from "pg";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  if (!username || !password) {
    return {
      status: "error",
      message: "Username and password are required",
    };
  }

  const client = new Client();
  await client.connect();

  const res = await client.query(
    "SELECT id, name, password FROM users WHERE username = $1",
    [username]
  );

  if (res.rowCount === 0) {
    return {
      status: "error",
      message: "User not found",
    };
  }

  const user = res.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      status: "error",
      message: "Invalid password provided",
    };
  }

  const sessionToken = crypto.randomUUID();

  await client.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [
    user.id,
    sessionToken,
  ]);

  await client.end();

  cookies().set("nuvi-auth", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return {
    status: "ok",
  };
}
