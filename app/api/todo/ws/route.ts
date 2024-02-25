import { Client } from "pg";

let currentConnections: {
  userID: string;
  listID: string;
  socket: import("ws").WebSocket;
}[] = [];

export async function SOCKET(
  client: import("ws").WebSocket,
  request: import("http").IncomingMessage,
  server: import("ws").WebSocketServer
) {
  console.log("A client connected!");

  client.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (!parsedMessage.action) {
      client.close();
      return;
    }
    if (parsedMessage.action === "auth") {
      const pgClient = new Client();
      await pgClient.connect();

      const tokenCheck = await pgClient.query(
        "SELECT user_id FROM sessions WHERE token = $1 AND create_time > NOW() - INTERVAL '30 days'",
        [parsedMessage.token]
      );

      if (tokenCheck.rowCount === 0) {
        client.close();
        return;
      }

      const userID = tokenCheck.rows[0].user_id;
      if (userID !== parsedMessage.userID) {
        client.close();
        return;
      }

      const accessCheck = await pgClient.query(
        `
            SELECT * FROM "todoListUserRoles" WHERE list_id = $1 AND user_id = $2
            `,
        [parsedMessage.listID, userID]
      );

      if (accessCheck.rows.length === 0) {
        client.close();
        return;
      }

      pgClient.end();

      currentConnections.push({
        userID: parsedMessage.userID,
        listID: parsedMessage.listID,
        socket: client,
      });
    } else if (parsedMessage.action === "tick") {
      const pgClient = new Client();
      await pgClient.connect();

      const task = await pgClient.query(
        `
            SELECT "order", "open" FROM "todoTasks" WHERE list = $1 AND id = $2
            `,
        [parsedMessage.listID, parsedMessage.id]
      );

      if (task.rows.length === 0) {
        console.log("asda");
        client.close();
        return;
      }

      await pgClient.query(
        `
            UPDATE "todoTasks" SET "open" = $1 WHERE list = $2 AND id = $3
            `,
        [!task.rows[0].open, parsedMessage.listID, parsedMessage.id]
      );

      pgClient.end();

      currentConnections.forEach((connection) => {
        if (connection.listID === parsedMessage.listID) {
          connection.socket.send(
            JSON.stringify({
              action: "tick",
              status: "ok",
              newOpen: !task.rows[0].open,
              id: parsedMessage.id,
            })
          );
        }
      });
    } else if (parsedMessage.action === "create") {
      const pgClient = new Client();
      await pgClient.connect();

      const maxOrder = await pgClient.query(
        `
            SELECT MAX("order") FROM "todoTasks" WHERE list = $1
            `,
        [parsedMessage.listID]
      );

      let newOrder = 0;
      if (maxOrder.rows[0].max !== null) {
        newOrder = maxOrder.rows[0].max + 1;
      }

      const userID = currentConnections.find(
        (connection) => connection.listID === parsedMessage.listID
      )?.userID;

      const newTask = await pgClient.query(
        `
            INSERT INTO "todoTasks" (list, content, "order", open, owner) VALUES ($1, $2, $3, true, $4) RETURNING id
            `,
        [parsedMessage.listID, parsedMessage.content, newOrder, userID]
      );

      pgClient.end();

      currentConnections.forEach((connection) => {
        if (connection.listID === parsedMessage.listID) {
          connection.socket.send(
            JSON.stringify({
              action: "create",
              id: newTask.rows[0].id,
              order: newOrder,
            })
          );
        }
      });
    } else {
      // Handle other actions
      console.log("Other action:", parsedMessage);
    }
  });

  client.on("close", () => {
    console.log("A client disconnected!");
    currentConnections = currentConnections.filter(
      (connection) => connection.socket !== client
    );
  });
}

export function GET() {
  return new Response("Hello, world!");
}
