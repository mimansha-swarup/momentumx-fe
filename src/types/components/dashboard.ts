import { ReactElement } from "react";

export interface IGeneratedTopic {
  title: string;
  id: string;
  createdAt: string;
  createdBy: string;
}
export interface IGeneratedContentProps {
  heading: string;
  headingClassName?: string;
  list: IGeneratedTopic[];
}
export interface IDashboardCard {
  label: string;
  value: string;
  icon: ReactElement;
}
