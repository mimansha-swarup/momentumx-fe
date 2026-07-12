import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import {
  currentUser,
  selectCompleteness,
  selectIsRefreshing,
  selectIsUpdating,
  selectUserError,
} from "@/utils/feature/user/user.slice";
import { refreshContext, updateProfile } from "@/utils/feature/user/user.thunk";
import { VideoFormat } from "@/types/feature/user";

const emptyForm = {
  userName: "",
  brandName: "",
  niche: "",
  targetAudience: "",
  website: "",
  format: "talking_head" as VideoFormat,
};

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(currentUser);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isRefreshing = useAppSelector(selectIsRefreshing);
  const completeness = useAppSelector(selectCompleteness);
  const error = useAppSelector(selectUserError);

  const [form, setForm] = useState(emptyForm);

  // Hydrate the form whenever the canonical profile changes (load / refresh).
  useEffect(() => {
    if (!user) return;
    setForm({
      userName: user.userName ?? "",
      brandName: user.brandName ?? "",
      niche: user.niche ?? "",
      targetAudience: user.targetAudience ?? "",
      website: user.website ?? "",
      format: user.format ?? "talking_head",
    });
  }, [user]);

  const handleSave = () => {
    dispatch(
      updateProfile({
        userName: form.userName.trim() || undefined,
        brandName: form.brandName.trim() || undefined,
        niche: form.niche.trim() || undefined,
        targetAudience: form.targetAudience.trim() || undefined,
        website: form.website.trim() || undefined,
        format: form.format,
      })
    );
  };

  const textField = (
    key: "userName" | "brandName" | "niche" | "targetAudience" | "website",
    label: string,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <div>
      <Header title="Settings" />
      <div className="max-w-2xl space-y-4">
        {completeness && (
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-title">Profile completeness</span>
              <span className="text-label">{completeness.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${completeness.score}%` }}
              />
            </div>
            {completeness.missing.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Add to improve: {completeness.missing.join(", ")}
              </p>
            )}
          </GlassCard>
        )}

        <GlassCard className="p-6 space-y-4">
          {textField("userName", "YouTube channel URL", "https://youtube.com/@yourchannel")}
          {textField("brandName", "Brand / channel name")}
          {textField("niche", "Niche")}
          {textField("targetAudience", "Target audience")}
          {textField("website", "Website", "https://…")}

          <div className="space-y-2">
            <Label>Video format</Label>
            <Select
              value={form.format}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, format: v as VideoFormat }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="talking_head">Talking head</SelectItem>
                <SelectItem value="faceless">Faceless</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              className="btn-primary-glow"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="size-4 animate-spin" aria-label="Saving" />
              ) : (
                "Save changes"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => dispatch(refreshContext())}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`size-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh context
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SettingsPage;
