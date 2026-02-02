import {
  LogOut,
  Settings2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { googleLogOut } from "@/utils/firebase/login";
import { useNavigate } from "react-router-dom";

export function DrawerMenu() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings2 className="ml-auto size-4 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuItem onClick={() => googleLogOut(navigate)}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
