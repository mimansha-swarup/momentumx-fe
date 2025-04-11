export interface IUserProfile {
  brandName: string;
  competitors: string[]; // assuming it's always an array of URLs
  createdAt: string; // or Firebase Timestamp if using Firestore directly
  email: string;
  name: string;
  niche: string;
  photoURL: string;
  targetAudience: string;
  uid: string;
  userName: string;
}

export interface IUserInitialState {
  data: IUserProfile | null;
  isLoading: boolean;
}
