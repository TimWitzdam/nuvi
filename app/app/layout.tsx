"use client";

import Image from "next/image";
import NuviLogo from "@/public/nuvi-logo.svg";
import MenuButton from "@/app/_components/MenuButton";
import { useState } from "react";
import AppMenu from "../_components/AppMenu";
import ListMenu from "../_components/ListMenu";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();

  function renderMenu() {
    if (path === "/app") {
      return <AppMenu isOpen={menuOpen} />;
    }
    return <ListMenu isOpen={menuOpen} />;
  }

  return (
    <div>
      <div className="pt-6 px-6 max-w-4xl mx-auto flex items-center justify-between">
        <Image src={NuviLogo} alt="Nuvi logo" width={100} />
        <MenuButton onClick={() => setMenuOpen(true)} open={menuOpen}>
          {renderMenu()}
        </MenuButton>
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed top-0 left-0  w-screen h-screen z-40"
          ></div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
