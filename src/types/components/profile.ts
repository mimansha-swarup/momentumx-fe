import React from "react";
import { IUserProfile } from "../feature/user";



export interface IUserDetailsProps {
  user: IUserProfile | null;
}
export interface IUserSettingsProps {
  user: IUserProfile | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDeleteAccount: () => void;
  isLoading: boolean;
  isDeleting: boolean;
}
