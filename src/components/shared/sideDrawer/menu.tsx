import {
  LogOut,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { googleLogOut } from "@/utils/firebase/login";
import { useNavigate } from "react-router-dom";

export function DrawerMenu() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account menu"
          className="ml-auto size-7"
        >
          <Settings2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuItem onClick={() => navigate("/app/settings")}>
          <SlidersHorizontal />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => googleLogOut(navigate)}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
