"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cross from "@/public/cross.svg";
import UserRounded from "@/public/user-rounded.svg";
import { formatUserName } from "@/utils/format";
import BaseSelect from "@/app/_components/BaseSelect";
import AddUserModal from "@/app/_components/AddUserModal";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.allUsers);
        setLoading(false);
      });
  }, []);

  function renderUsers() {
    return users.map((user) => (
      <div
        key={user.id}
        className={`p-6 flex flex-col gap-6 justify-between border-b-2 border-black border-opacity-20 sm:flex-row sm:items-center`}
      >
        <div className="flex items-center gap-2">
          <Image src={UserRounded} alt="User" width={40} height={40} />
          <p>
            {user.name} ({user.username})
          </p>
        </div>
        <BaseSelect
          name={formatUserName(user.name)}
          options={[
            { label: "Admin", value: "Admin" },
            { label: "Collaborator", value: "Collaborator" },
          ]}
          defaultValue={user.role}
          onChange={(e) => console.log(e)}
        />
      </div>
    ));
  }

  function handleAddUserModalSubmit(
    name: string,
    userName: string,
    role: string,
    password: string
  ) {
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, userName, role, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const newUser = {
          id: data.id,
          name,
          username: userName,
          role,
        };
        setUsers((prev) => [...prev, newUser]);
        setShowAddUserModal(false);
      });
  }

  return (
    <div className="pt-6 px-6 max-w-4xl mx-auto mt-12">
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSubmit={handleAddUserModalSubmit}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-2 md:text-center">Manage users</h1>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-black rounded-full w-10 h-10 grid place-content-center"
        >
          <Image
            src={Cross}
            alt="Add list icon"
            width={30}
            height={30}
            className="rotate-45"
          />
        </button>
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white border-2 border-black rounded-xl">
            {renderUsers()}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="p-6 flex items-center gap-2  w-full hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <div className="bg-black rounded-full w-10 h-10 grid place-content-center group-hover:scale-110  transition-transform">
                <Image
                  src={Cross}
                  alt="Add user"
                  width={30}
                  height={30}
                  className="rotate-45 "
                />
              </div>
              <p>Add user</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
