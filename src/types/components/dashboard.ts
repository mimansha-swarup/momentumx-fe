import { ReactElement, RefObject } from "react";

export interface IGeneratedIdea {
  title: string;
  // Idea fields (backend phase 2): step 1 now generates video CONCEPTS, not
  // headlines. `title` is the plain-language working title. Optional — legacy
  // and bring-your-own-title ideas lack them.
  concept?: string | null;
  ideaType?: "long" | "short" | null;
  evidence?: string | null;
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  isScriptGenerated: boolean;
  archived: boolean;
  batchId: string;
  videoProjectId: string | null;
  userFeedback: "like" | "dislike" | null;
}
export interface IGeneratedContentProps {
  heading: string;
  headingClassName?: string;
  list: IGeneratedIdea[];
  listRef?: RefObject<HTMLDivElement | null>;
  loading?: boolean;
}
export interface IDashboardCard {
  label: string;
  value: string;
  icon: ReactElement;
}
