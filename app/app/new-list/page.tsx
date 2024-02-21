"use client";

import BaseInput from "@/app/_components/BaseInput";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import UserRounded from "@/public/user-rounded.svg";
import Crown from "@/public/crown.svg";
import Transhcan from "@/public/trashcan.svg";
import BaseButton from "@/app/_components/BaseButton";
import AddUserModal from "@/app/_components/AddUserModal";
import { useRouter } from "next/navigation";
import BaseSelect from "@/app/_components/BaseSelect";

interface User {
  id: string;
  name: string;
  role: string;
}

export default function NewListPage() {
  const [listName, setListName] = useState("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [creatorID, setCreatorID] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  const userSelect = useRef<HTMLSelectElement>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/users", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailableUsers(data.allUsers);
        setSelectedUsers([data.loggedInAs]);
        setCreatorID(data.loggedInAs.id);
        setLoading(false);
      });
  }, []);

  function handleUserSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "create") {
      setAddUserModalOpen(true);
    } else {
      const selectedUser = availableUsers.find(
        (user: User) => user.id === e.target.value
      );
      if (selectedUser) {
        setSelectedUsers([...selectedUsers, selectedUser]);
      }
      const newAvailableUsers = availableUsers.filter(
        (user: User) => user.id !== e.target.value
      );
      setAvailableUsers(newAvailableUsers);
      e.target.value = "choose";
    }
  }

  function handleDeleteClick(id: string) {
    const deletedUser = selectedUsers.find((user: User) => user.id === id);
    if (deletedUser) {
      setAvailableUsers([...availableUsers, deletedUser]);
    }
    const newSelectedUsers = selectedUsers.filter(
      (user: User) => user.id !== id
    );
    setSelectedUsers(newSelectedUsers);
  }

  function closeAddUserModal() {
    setAddUserModalOpen(false);
    if (userSelect.current != null) {
      userSelect.current.value = "choose";
    }
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
          role,
        };
        setSelectedUsers([...selectedUsers, newUser]);
        closeAddUserModal();
      });
  }

  function handleCreateListClick() {
    fetch("/api/todo/lists", {
      method: "POST",
      body: JSON.stringify({ name: listName, users: selectedUsers }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        router.replace(`/app/lists/${data.id}`);
      });
  }

  return (
    <div className="pt-6 px-6 max-w-4xl mx-auto mt-8">
      {addUserModalOpen && (
        <AddUserModal
          onClose={closeAddUserModal}
          onSubmit={handleAddUserModalSubmit}
        />
      )}
      <h1 className="text-3xl font-bold mb-6 md:text-center">
        Create new list
      </h1>
      <BaseInput
        id="list-name"
        type="text"
        placeholder="List name"
        onChange={(e) => setListName(e.target.value)}
        classname="w-full mb-20"
      />
      <h2 className="text-3xl font-bold mb-6 md:text-center">Users</h2>
      <div className="mb-8 flex flex-col gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          selectedUsers.map((user) => (
            <div
              className="rounded-xl border-2 border-black p-4 flex items-center justify-between"
              key={user.id}
            >
              <div className="flex items-center gap-4">
                <Image src={UserRounded} alt="User" width={40} height={40} />
                <p>{user.name}</p>
              </div>
              {user.id === creatorID ? (
                <Image src={Crown} alt="Crown" width={35} height={35} />
              ) : (
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="rounded-full bg-black w-10 h-10 grid place-content-center"
                >
                  <Image
                    src={Transhcan}
                    alt="Trashcan"
                    width={15}
                    height={15}
                  />
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <BaseSelect
        refRelation={userSelect}
        name="users"
        options={[
          { label: "Add another user", value: "choose" },
          { label: "Crease new user", value: "create" },
          ...availableUsers.map((user) => ({
            label: user.name,
            value: user.id,
          })),
        ]}
        defaultValue="choose"
        defaultDisabled
        onChange={handleUserSelect}
        classname="mb-20"
      />
      <BaseButton
        id="create-list"
        onClick={handleCreateListClick}
        classname="w-full"
      >
        Create list
      </BaseButton>
    </div>
  );
}
