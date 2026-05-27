import { IUserProfile } from "@/types/feature/user";

export interface IUserDetailsProps {
  user: IUserProfile | null;
}

export interface IUserSettingsProps {
  user: IUserProfile;
}
