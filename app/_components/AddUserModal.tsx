import { useRef, useState } from "react";
import BaseInput from "./BaseInput";
import BaseSelect from "./BaseSelect";
import { generateSecurePassword } from "@/utils/generatePassword";

interface Props {
  onClose: () => void;
  onSubmit: (
    name: string,
    userName: string,
    role: string,
    password: string
  ) => void;
}

export default function AddUserModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("Admin");
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedPasswordSpan = useRef<HTMLSpanElement>(null);

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

  function handleSubmitClick() {
    const password = generateSecurePassword(8);
    setGeneratedPassword(password);
    setShowGeneratedPassword(true);
  }

  function copyGeneratedPassword() {
    console.log("copy");
    let range = document.createRange();
    range.selectNodeContents(generatedPasswordSpan.current!);
    let sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
    setCopied(true);
  }

  function handlePasswordClose() {
    if (!copied) copyGeneratedPassword();
    onSubmit(name, userName, role, generatedPassword);
  }

  return (
    <div>
      <div
        onClick={onClose}
        className="fixed bg-black bg-opacity-60 top-0 left-0 w-screen h-screen z-40"
      ></div>
      <div className="fixed px-6 w-full  max-w-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white p-8 rounded-xl">
          {!showGeneratedPassword ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add User</h2>
              <form onSubmit={handleSubmitClick}>
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
                  <BaseSelect
                    name="role"
                    options={[
                      { label: "Collaborator", value: "Collaborator" },
                      { label: "Admin", value: "Admin" },
                    ]}
                    defaultValue="Collaborator"
                    onChange={(e) => setRole(e.target.value)}
                    classname="w-full"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={onClose}
                    className="p-4 rounded-xl border-2 border-black w-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-4 rounded-xl bg-black text-white w-full"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-2">Generated Password</h2>
              <p className="opacity-60 mb-6">
                Please provide this password to the user. He'll be asked to
                change it when first logging in.
              </p>
              <p className="mb-2">Your generated password is:</p>
              <div
                onClick={copyGeneratedPassword}
                className="rounded-xl border-2 border-black p-4 w-full mb-10"
              >
                <span ref={generatedPasswordSpan}>{generatedPassword}</span>
              </div>
              <button
                onClick={handlePasswordClose}
                className="p-4 rounded-xl bg-black text-white w-full"
              >
                {copied ? "Close" : "Copy & Close"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
