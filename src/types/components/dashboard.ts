import { ReactElement, RefObject } from "react";

export interface IGeneratedTopic {
  title: string;
  id: string;
  createdAt: string;
  createdBy: string;
  isScriptGenerated: boolean;
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
