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
    <div className="pt-6 px-6 max-w-4xl mx-auto">
      <div className="mb-20">
        <Image src={NuviLogo} alt="Nuvi logo" width={100} />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2 md:text-center">
          Login to {nuviConfig.identity.name}'s nuvi
        </h1>
        <p className="opacity-60 mb-8 md:text-center">
          Welcome to nuvi, the simplest and free to use todo list
        </p>
        <form action="submit">
          <BaseInput
            id="username"
            type="text"
            placeholder="@username"
            onChange={(e) => setUsername(e.target.value)}
            classname="w-full mb-4 md:w-2/3 mx-auto"
            autocomplete="username"
          />
          <BaseInput
            id="password"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            classname="w-full md:w-2/3 mx-auto"
            autocomplete="current-password"
          />
          <BaseButton
            id="login"
            type="submit"
            classname="w-full mt-4 md:w-2/3 mx-auto"
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
