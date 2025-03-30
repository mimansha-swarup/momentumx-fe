import { ReactNode } from "react";

export interface StepperProps {
  orientation?: string;
  steps: Steps[];
  activeStep: number;
}

export interface Steps {
  label: string;
  key: string;
  // icon: any;
  // component: any;
}
export interface IGlassCardProps {
  children: ReactNode;
  className?: string;
}
