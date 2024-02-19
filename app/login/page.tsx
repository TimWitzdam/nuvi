"use client";

import Image from "next/image";
import NuviLogo from "@/public/nuvi-logo.svg";
import nuviConfig from "@/nuvi-config";
import BaseInput from "../_components/BaseInput";
import { useState } from "react";
import BaseButton from "../_components/BaseButton";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="pt-6 px-6 mb-20">
        <Image src={NuviLogo} alt="Nuvi logo" width={100} />
      </div>
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-2">
          Login to {nuviConfig.identity.name}'s nuvi
        </h1>
        <p className="opacity-60 mb-4">
          Welcome to nuvi, the simplest and free to use todo list
        </p>
        <form action="submit">
          <BaseInput
            id="username"
            type="text"
            placeholder="@username"
            onChange={(e) => setUsername(e.target.value)}
            classname="w-full mb-4"
            autocomplete="username"
          />
          <BaseInput
            id="password"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            classname="w-full"
            autocomplete="current-password"
          />
          <BaseButton
            id="login"
            type="submit"
            classname="w-full mt-4"
            onClick={(e) => {
              e.preventDefault();
              console.log(username);
            }}
          >
            login
          </BaseButton>
        </form>
      </div>
    </div>
  );
}
