import { useState } from "react";
import BaseInput from "./BaseInput";

interface Props {
  onClose: () => void;
}

export default function AddUserModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("Admin");

  function handleUserNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.length === 0) {
      setUserName("");
    } else {
      if (value[0] !== "@") {
        setUserName(`@${value.toLowerCase()}`);
        e.target.value = `@${value.toLowerCase()}`;
      } else {
        setUserName(value.toLowerCase());
      }
    }
  }

  return (
    <div>
      <div
        onClick={onClose}
        className="fixed bg-black bg-opacity-60 top-0 left-0 w-screen h-screen z-40"
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add User</h2>
        <form>
          <div>
            <BaseInput
              id="name"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              classname="mb-4 w-full"
            />
            <BaseInput
              id="username"
              type="text"
              placeholder="@username"
              onChange={handleUserNameChange}
              classname="mb-10 w-full"
            />
            <select
              name="role"
              id="role"
              className="p-4 rounded-xl border-2 border-black outline-none focus:bg-gray-100 transition-colors w-full"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Collaborator">Collaborator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="p-4 rounded-lg border-2 border-black w-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-4 rounded-lg bg-black text-white w-full"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
