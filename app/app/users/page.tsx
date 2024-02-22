"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Cross from "@/public/cross.svg";
import UserRounded from "@/public/user-rounded.svg";
import { formatUserName } from "@/utils/format";
import BaseSelect from "@/app/_components/BaseSelect";
import AddUserModal from "@/app/_components/AddUserModal";
import BaseModal from "@/app/_components/BaseModal";

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
  const [resettedPassword, setResetPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [resetPasswordClicked, setResetPasswordClicked] = useState<User | null>(
    null
  );

  const resettedPasswordSpan = useRef<HTMLSpanElement>(null);

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
        <div className="flex items-center gap-4">
          <button
            onClick={() => setResetPasswordClicked(user)}
            className="p-4 rounded-xl bg-black text-white"
          >
            Reset Password
          </button>
          <BaseSelect
            name={formatUserName(user.username)}
            options={[
              { label: "Admin", value: "Admin" },
              { label: "Collaborator", value: "Collaborator" },
            ]}
            defaultValue={user.role}
            onChange={(e) => handleUserRoleChange(user, e)}
          />
        </div>
      </div>
    ));
  }

  function resetPassword(id: string) {
    setResetPasswordClicked(null);
    fetch(`/api/users/reset-password`, {
      method: "POST",
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResetPassword(data.password);
      });
  }

  function copyResettedPassword() {
    console.log("copy");
    let range = document.createRange();
    range.selectNodeContents(resettedPasswordSpan.current!);
    let sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
    setCopied(true);
  }

  function handlePasswordClose() {
    if (!copied) copyResettedPassword();
    setResetPassword("");
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

  function handleUserRoleChange(
    user: User,
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newRole = e.target.value;
    fetch(`/api/users`, {
      method: "PATCH",
      body: JSON.stringify({ id: user.id, role: newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === user.id) {
              return { ...u, role: newRole };
            }
            return u;
          })
        );
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
      {resetPasswordClicked && (
        <BaseModal onClose={() => setResetPasswordClicked(null)}>
          <h2 className="text-2xl font-bold mb-2">Reset password</h2>
          <p className="mb-6">
            <span className="opacity-60">
              Are you sure you want to reset the password for{" "}
            </span>
            {resetPasswordClicked.name}
            <span className="opacity-60">?</span>
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setResetPasswordClicked(null)}
              className="p-4 rounded-xl border-2 border-black w-full"
            >
              Cancel
            </button>
            <button
              onClick={() => resetPassword(resetPasswordClicked.id)}
              className="p-4 rounded-xl bg-black text-white w-full"
            >
              Reset password
            </button>
          </div>
        </BaseModal>
      )}
      {resettedPassword && (
        <BaseModal onClose={() => setResetPassword("")}>
          <h2 className="text-2xl font-bold mb-2">Reset password</h2>
          <p className="opacity-60 mb-6">
            Please provide this password to the user. He'll be asked to change
            it when first logging in.
          </p>
          <p className="mb-2">The new password is:</p>
          <div
            onClick={copyResettedPassword}
            className="rounded-xl border-2 border-black p-4 w-full mb-10"
          >
            <span ref={resettedPasswordSpan}>{resettedPassword}</span>
          </div>
          <button
            onClick={handlePasswordClose}
            className="p-4 rounded-xl bg-black text-white w-full"
          >
            {copied ? "Close" : "Copy & Close"}
          </button>
        </BaseModal>
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
