"use client";

import Image from "next/image";
import NuviLogo from "@/public/nuvi-logo.svg";
import MenuButton from "@/app/_components/TopMenu/MenuButton";
import { useState } from "react";
import AppMenu from "@/app/_components/TopMenu/AppMenu";
import { usePathname } from "next/navigation";
import MenuItem from "../_components/TopMenu/MenuItem";
import Add from "@/public/add.svg";
import User from "@/public/user.svg";
import Gears from "@/public/gears.svg";
import Logout from "@/public/logout.svg";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();

  function renderMenuItems() {
    if (path === "/app") {
      return (
        <div>
          <MenuItem title="New list" link="/app/new-list" icon={Add} />
          <MenuItem title="Manage users" link="/app/manage-users" icon={User} />
          <MenuItem title="Settings" link="/app/settings" icon={Gears} />
          <MenuItem title="Log out" link="/app/logout" icon={Logout} last />
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <div className="pt-6 px-6 max-w-4xl mx-auto flex items-center justify-between">
        <Image src={NuviLogo} alt="Nuvi logo" width={100} />
        <MenuButton onClick={() => setMenuOpen(true)} open={menuOpen}>
          <AppMenu
            isOpen={menuOpen}
            handleClick={(event) => {
              setMenuOpen(false);
              event.stopPropagation();
            }}
          >
            {renderMenuItems()}
          </AppMenu>
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
