import React from "react";
import { Button } from "@/components/ui/button";
import { IUserSettingsProps } from "@/types/components/profile";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectIsUpdating,
  userLoading,
} from "@/utils/feature/user/user.slice";
import { updateProfile } from "@/utils/feature/user/user.thunk";
import { getUser } from "@/utils/feature/user/user.thunk";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastError, toastSuccess } from "@/utils/toast";

const UserSettings: React.FC<IUserSettingsProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectIsUpdating);
  const isLoading = useAppSelector(userLoading);
  const { formData, updateField } = useUserProfile(false, user);

  const isReEnriching = isLoading && !isUpdating;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toastSuccess("Profile updated. Re-enriching your data...");
      dispatch(getUser());
    } else if (updateProfile.rejected.match(result)) {
      toastError(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to update profile"
      );
    }
  };

  const inputClass = cn(
    "w-full rounded-lg px-4 py-2.5 text-sm",
    "bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent",
    "transition-colors duration-200"
  );

  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground">Edit Profile</h3>

      {isReEnriching && (
        <div
          aria-live="polite"
          className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Re-enriching your profile data...</span>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="brandName" className={labelClass}>
            Business Offering
          </label>
          <input
            id="brandName"
            type="text"
            value={formData.business?.offering ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("business.offering", e.target.value)
            }
            placeholder="What do you offer?"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="niche" className={labelClass}>
            Niche
          </label>
          <input
            id="niche"
            type="text"
            value={formData.business?.type === "other"
              ? formData.business?.type_other ?? ""
              : formData.business?.type ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (formData.business?.type === "other") {
                updateField("business.type_other", e.target.value);
              } else {
                updateField("business.type", e.target.value);
              }
            }}
            placeholder="Your content niche"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="targetAudience" className={labelClass}>
            Target Audience
          </label>
          <input
            id="targetAudience"
            type="text"
            value={formData.avatar?.definition ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("avatar.definition", e.target.value)
            }
            placeholder="Who is your ideal viewer?"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="youtubeUrl" className={labelClass}>
            YouTube URL
          </label>
          <input
            id="youtubeUrl"
            type="url"
            value={formData.assets?.youtube_url ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField("assets.youtube_url", e.target.value)
            }
            placeholder="https://youtube.com/@handle"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="oneLiner" className={labelClass}>
          One-Liner Description
        </label>
        <input
          id="oneLiner"
          type="text"
          value={formData.positioning?.one_liner ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateField("positioning.one_liner", e.target.value)
          }
          placeholder="Describe what you do in one sentence"
          className={inputClass}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-200"
        disabled={isUpdating || isReEnriching}
      >
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          "Update Profile"
        )}
      </Button>
    </form>
  );
};

export default UserSettings;
