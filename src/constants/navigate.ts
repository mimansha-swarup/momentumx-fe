import { Home, Lightbulb, FileText, Settings } from "lucide-react";

export const urlMapping = [
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
