import React from "react";

export interface OnboardingCardProps {
  title: string;
  description: string;
  onNext: () => void;
  onPrevious: () => void;
  children: React.ReactNode;
  disablePrevious?: boolean;
  showNext?: boolean;
  isLoading?: boolean;
}

export interface IOnboardingFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string | string[];
  error: string | string[];
  label: string;
  id: string;
  inputType: string;
  placeholder: string;
  removeMultiValue?: (index: number) => () => void;
  addMultiValue?: () => void;
  className?: string;
}

export interface OnboardingForm {
  brandName: string;
  website: string;
  niche: string;
  competitors: string[];
  userName: string;
  targetAudience: string;
}
