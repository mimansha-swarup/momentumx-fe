import { Home, Search } from "lucide-react";

export const urlMapping = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: Home,
    route: "/app/dashboard",
    subRoutes: ["/app/project/:projectId"],
  },
  {
    name: "research",
    label: "Idea",
    icon: Search,
    route: "/app/research",
    subRoutes: [],
  },
];
