import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { brandName } from "@/constants/root";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { urlMapping } from "@/constants/navigate";
import { DrawerMenu } from "./menu";
import { useAuthCredential } from "@/hooks/useAuth";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

type RouteObjType = (typeof urlMapping)[number];
const SideDrawer = () => {
  const { user } = useAuthCredential();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigation = (url: string) => () => {
    navigate(url);
  };
  const isActive = (routeObj: RouteObjType) => {
    // First check direct match
    if (pathname === routeObj.route) return true;

    // Then check if any subRoutes match, including dynamic patterns
    return (routeObj?.subRoutes as string[])?.some((subRoute) =>
      matchPath({ path: subRoute, end: false }, pathname)
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="text-2xl font-semibold p-4 pt-8 text-center border-b  mx-4">
        {brandName}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-3 mt-10">
          {urlMapping?.map((urlObj) => (
            <SidebarMenuItem
              key={urlObj.name}
              onClick={handleNavigation(urlObj.route)}
            >
              <span
                className={cn(
                  "flex font-semibold text-md cursor-pointer hover:bg-gray-100 !p-3 gap-2 items-center rounded-xl transition-all duration-200 ease-in-out",
                  isActive(urlObj) && "bg-primary/10 text-primary"
                )}
              >
                {" "}
                <urlObj.icon className="size-5" /> {urlObj.label}
              </span>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row items-center gap-4 py-4  px-0 border-t mx-4">
        <Avatar>
          <AvatarImage src={user?.photoURL} alt="@shadcn" />
          <AvatarFallback>{user?.name?.[0] || "A"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-md">{user?.name}</p>
          <p className="text-accent-foreground text-xs">{user?.userName}</p>
        </div>
        <DrawerMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideDrawer;
