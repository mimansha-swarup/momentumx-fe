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

const SideDrawer = () => {
  return (
    <Sidebar>
      <SidebarHeader className="text-2xl font-semibold p-4 pt-8 text-center border-b  mx-4">
        {brandName}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-3 mt-10">
          {urlMapping?.map((urlObj) => (
            <SidebarMenuItem key={urlObj.name}>
              <span
                className={cn(
                  "flex font-semibold text-md cursor-pointer hover:bg-gray-100 !p-3 gap-2 items-center rounded-xl",
                  urlObj.name === "dashboard" && "bg-primary/10 text-primary"
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
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-md">userName</p>
          <p className="text-accent-foreground text-xs">userName</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideDrawer;
