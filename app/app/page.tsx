"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TodoList from "@/app/_components/TodoList";
import Cross from "@/public/cross.svg";

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
    <div className="pt-6 px-6 max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-2 md:text-center">Your lists</h1>
        <button className="bg-black rounded-full w-10 h-10 grid place-content-center">
          <Image
            src={Cross}
            alt="Add list icon"
            width={30}
            height={30}
            className="rotate-45"
          />
        </button>
      </div>

      <div>{loading ? <div>Loading...</div> : <div>{renderLists()}</div>}</div>
    </div>
  );
}
