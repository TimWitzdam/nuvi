"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NuviLogo from "@/public/nuvi-logo.svg";
import MenuButton from "@/app/_components/MenuButton";
import TodoList from "@/app/_components/TodoList";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<
    { id: string; name: string; open_tasks: number }[]
  >([]);

  useEffect(() => {
    fetch("/api/todo/lists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLists(data);
        setLoading(false);
      });
  }, []);

  function renderLists() {
    return lists.map((list) => (
      <TodoList
        key={list.id}
        name={list.name}
        id={list.id}
        openTasks={list.open_tasks}
      />
    ));
  }

  return (
    <div className="pt-6 px-6 max-w-4xl mx-auto">
      <div className="mb-14 flex items-center justify-between">
        <Image src={NuviLogo} alt="Nuvi logo" width={100} />
        <MenuButton onClick={() => console.log("Open Menu")} />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2 md:text-center">Your lists</h1>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {renderLists()}
              {/* <TodoList name="Todo's" id="1" openTasks={43} /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
