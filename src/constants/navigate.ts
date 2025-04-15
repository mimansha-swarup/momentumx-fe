import { Home, Lightbulb, FileText, Settings } from "lucide-react";

export const urlMapping = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: Home,
    route: "/dashboard",
    subRoutes: [],
  },
  {
    name: "title",
    label: "Titles",
    icon: Lightbulb,
    route: "/title",
    subRoutes: [],
  },
  {
    name: "script",
    label: "Scripts",
    icon: FileText,
    route: "/scripts",
    subRoutes: ["/script"],
  },
  {
    name: "setting",
    label: "Settings",
    icon: Settings,
    route: "/profile",
    subRoutes: [],
  },
];
