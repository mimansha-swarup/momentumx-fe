import { Home, Lightbulb, FileText, Settings, Search, Sparkles } from "lucide-react";
import { HIDE_OLD_FLOW } from "./root";

export const urlMapping = HIDE_OLD_FLOW
  ? [
      {
        name: "dashboard",
        label: "Dashboard",
        icon: Home,
        route: "/app/dashboard",
        subRoutes: ["/app/project/:projectId"],
      },
      {
        name: "research",
        label: "Research",
        icon: Search,
        route: "/app/research",
        subRoutes: [],
      },
      {
        name: "title-generator",
        label: "Title Generator",
        icon: Sparkles,
        route: "/app/title-generator",
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
