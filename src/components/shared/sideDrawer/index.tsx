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
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { extractYouTubeHandle } from "@/utils/onboarding";

type RouteObjType = (typeof urlMapping)[number];
const SideDrawer = () => {
  const { user, loading } = useAuthCredential();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigation = (url: string) => () => {
    navigate(url);
    if (window.innerWidth <= 765) toggleSidebar();
  };
  const isActive = (routeObj: RouteObjType) => {
    // First check direct match
    if (pathname === routeObj.route) return true;

    // Then check if any subRoutes match, including dynamic patterns
    return (routeObj?.subRoutes as string[])?.some((subRoute) =>
      matchPath({ path: subRoute, end: false }, pathname),
    );
  };

  const extractedUserName = extractYouTubeHandle(user?.userName || "");

  return (
    <Sidebar className="border-r border-sidebar-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SidebarHeader className="text-heading-lg p-4 pt-8 text-center border-b border-sidebar-border mx-4">
        <span className="gradient-text">{brandName}</span>
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
                  "nav-item",
                  isActive(urlObj) && "nav-item-active",
                 
                )}
              >
                <urlObj.icon className="size-5" /> {urlObj.label}
              </span>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex-row py-4 px-0 border-t border-sidebar-border mx-4">
        <Avatar className="avatar-ring">
          <AvatarImage src={user?.photoURL} alt="@shadcn" />
          <AvatarFallback className="avatar-fallback-styled">
            {user?.name?.[0] || extractedUserName?.[0]}
          </AvatarFallback>
        </Avatar>
        {loading ? (
          <div>
            <Skeleton className="h-2 w-28 bg-sidebar-accent" />
            <Skeleton className="h-2 w-20 bg-sidebar-accent mt-1" />
          </div>
        ) : (
          <div>
            <p className="text-title text-base">{user?.name}</p>
            <p className="text-caption">@{extractedUserName}</p>
          </div>
        )}
        <DrawerMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideDrawer;
