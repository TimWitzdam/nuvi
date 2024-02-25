"use client";

import TodoTask from "@/app/_components/TodoTask";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface Task {
  id: string;
  content: string;
  order: number;
  open: boolean;
}

export default function SingleListPage({
  params,
}: {
  params: { listID: string };
}) {
  const [tasks, setTasks] = useState<Task[]>([]);

  let hostname = "";
  if (typeof window !== "undefined") {
    hostname = `${window.location.hostname}:${window.location.port}`;
  }

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://${hostname}/api/todo/ws`,
    {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 100,
      onReconnectStop: (closeEvent) => {
        toast.error("Websocket connection failed, please refresh the page", {
          autoClose: false,
        });
      },
    }
  );

  useEffect(() => {
    fetch(`/api/todo/list/${params.listID}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);

        sendMessage(
          JSON.stringify({
            action: "auth",
            listID: params.listID,
            userID: data.userID,
            token: document.cookie
              .split(";")
              .find((c) => c.trim().startsWith("nuvi-auth="))
              ?.split("=")[1],
          })
        );
      });
  }, [params.listID]);

  useEffect(() => {
    if (lastMessage !== null) {
      const parsedMessage = JSON.parse(lastMessage?.data.toString());
      if (parsedMessage.action === "tick") {
        if (parsedMessage.status === "ok") {
          console.log("Before tasks: ", tasks);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === parsedMessage.id
                ? { ...task, open: parsedMessage.newOpen }
                : task
            )
          );
          console.log("New tasks: ", tasks);
        }
      }
      console.log("Message from server ", lastMessage?.data);
    }
  }, [lastMessage]);

  function handleTaskTickClick(id: string) {
    sendMessage(
      JSON.stringify({
        action: "tick",
        listID: params.listID,
        id,
      })
    );
    console.log("tick off", id);
  }

  return (
    <div className="flex flex-col">
      <div className="relative px-6 mt-4">
        {tasks.map((task: Task) => (
          <TodoTask
            key={task.id}
            id={task.id}
            content={task.content}
            open={task.open}
            tickClick={handleTaskTickClick}
          />
        ))}
        <div
          onClick={() => console.log("outside")}
          className="absolute w-full h-screen top-0 left-0 -z-10"
        ></div>
      </div>
    </div>
  );
}
