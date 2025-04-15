import { Book, Play, PlusCircle } from "lucide-react";

export const DASHBOARD_CARD = (
  topic: string,
  script: string,
  credit: string
) => [
  {
    id: "1",
    label: "Total Topics",
    value: topic,
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
