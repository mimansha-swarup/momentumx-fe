import { ReactElement, RefObject } from "react";

export interface IGeneratedTopic {
  title: string;
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
  list: IGeneratedTopic[];
  listRef?: RefObject<HTMLDivElement | null>;
  loading?: boolean;
}
export interface IDashboardCard {
  label: string;
  value: string;
  icon: ReactElement;
}
