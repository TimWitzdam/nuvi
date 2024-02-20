import MenuItem from "./MenuItem";
import Add from "@/public/add.svg";
import User from "@/public/user.svg";
import Gears from "@/public/gears.svg";
import Logout from "@/public/logout.svg";

interface Props {
  isOpen: boolean;
}

export default function AppMenu({ isOpen }: Props) {
  return (
    <div
      className={`app-menu absolute bg-white top-10 right-0 rounded-lg border-2 border-black z-50 w-[250px] ${
        isOpen ? "open" : "closed pointer-events-none"
      }`}
    >
      <MenuItem title="New list" link="/app/new-list" icon={Add} />
      <MenuItem title="Manage users" link="/app/manage-users" icon={User} />
      <MenuItem title="Settings" link="/app/settings" icon={Gears} />
      <MenuItem title="Log out" link="/app/logout" icon={Logout} last />
      <style>
        {`
          .app-menu {
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          }
          
          .app-menu.open {
            opacity: 1;
            transform: translateY(0);
          }
          
          .app-menu.closed {
            opacity: 0;
            transform: translateY(-10px);
          }
        `}
      </style>
    </div>
  );
}
