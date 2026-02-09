import { Home, Lightbulb, FileText, Settings, PackageOpen } from "lucide-react";
import { HIDE_OLD_FLOW } from "./root";

export const urlMapping = HIDE_OLD_FLOW
  ? [
      {
        name: "dashboard",
        label: "Dashboard",
        icon: Home,
        route: "/app/dashboard",
        subRoutes: [],
      },
      {
        name: "packaging",
        label: "YT Packaging",
        icon: PackageOpen,
        route: "/app/packaging",
        subRoutes: [],
      },
    ]
  : [
      {
        name: "dashboard",
        label: "Dashboard",
        icon: Home,
        route: "/app/dashboard",
        subRoutes: [],
      },
      {
        name: "title",
        label: "Titles",
        icon: Lightbulb,
        route: "/app/title",
        subRoutes: [],
      },
      {
        name: "script",
        label: "Scripts",
        icon: FileText,
        route: "/app/scripts",
        subRoutes: ["/app/script"],
      },
      {
        name: "setting",
        label: "Settings",
        icon: Settings,
        route: "/app/profile",
        subRoutes: [],
      },
    ];
