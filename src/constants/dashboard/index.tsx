import { Book, Play, PlusCircle } from "lucide-react";

export const DASHBOARD_CARD = (
  idea: string,
  script: string,
  credit: string
) => [
  {
    id: "1",
    label: "Total Ideas",
    value: idea,
    icon: <Book />,
  },
  {
    id: "2",
    label: "Script Generated",
    value: script,
    icon: <Play />,
  },
  {
    id: "3",
    label: "Available Credit",
    value: credit,
    icon: <PlusCircle />,
  },
];
