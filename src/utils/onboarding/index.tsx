import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IOnboardingPayload,
  DeepNest,
  QuestionBase,
  Option,
  GroupField,
  ConditionalRule,
} from "@/types/components/onboarding";
import React from "react";

export const getValueByPath = (obj: DeepNest | IOnboardingPayload, path: string): unknown => {
  if (!obj || !path) return undefined;

  // Convert "a.b[0].c" → ["a", "b", 0, "c"]
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1") // [0] → .0
    .split(".")
    .map((part) => (isNaN(Number(part)) ? part : Number(part)));

  return parts.reduce<unknown>((acc, key: string | number) => {
    if (acc == null) return undefined;
    return (acc as Record<string | number, unknown>)[key];
  }, obj);
};

export const renderUserForm = ({
  question,
  value,
  updateField,
  formState,
  errors,
  onEnter
}: {
  question: QuestionBase;
  value: unknown;
  updateField: (path: string, value: unknown) => void;
  formState: IOnboardingPayload;
  errors: Record<string, string>;
  onEnter?: (e: React.KeyboardEvent) => void;
}) => {
  /* -------------------------------------------------------------------------- */
  /*                               RENDER INPUT                                 */
  /* -------------------------------------------------------------------------- */

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => updateField(question.path || "", e.target.value)}
            placeholder={question.placeholder || ""}
            required={question.required}
            onKeyDown={onEnter}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => updateField(question.path || "", e.target.value)}
            placeholder={question.placeholder || ""}
            rows={question.rows || 4}
            required={question.required}
            onKeyDown={onEnter}
          />
        );

      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) => updateField(question.path || "", val)}
          >
            {question?.options?.map((opt: Option) => (
              <label key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} />
                <span>{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((opt: Option) => {
              const checked = Array.isArray(value)
                ? value.includes(opt.value)
                : false;

              return (
                <label key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(state) => {
                      let updated = Array.isArray(value) ? [...(value as string[])] : [];
                      if (state) updated.push(opt.value);
                      else updated = updated.filter((v) => v !== opt.value);

                      updateField(question.path || "", updated);
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        );

      case "dropdown":
        return (
          <Select
            value={(value as string) || ""}
            onValueChange={(val) => updateField(question.path || "", val)}
          >
            <SelectTrigger className="min-w-[200px] transition-all duration-200">
              <SelectValue placeholder={question.placeholder || ""} />
            </SelectTrigger>

            <SelectContent>
              {question.options?.map((opt: Option) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      /* -------------------------------------------------------------------------- */
      /*                                  GROUP                                     */
      /* -------------------------------------------------------------------------- */

      case "group": {
        const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [{}];

        const addRow = () => {
          updateField(question.path || "", [...rows, {}]);
        };

        const removeRow = (index: number) => {
          const filtered = rows.filter((_, i) => i !== index);
          updateField(question.path || "", filtered);
        };

        return (
          <div className="max-h-[300px] overflow-x-auto">
            {rows.map((_row, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4 py-2 bg-muted/20"
              >
                {question.groupFields?.map((f: GroupField) => {
                  const fullPath = `${question.path}[${index}].${f.path}`;

                  return (
                    <div key={fullPath}>
                      {renderUserForm({
                        question: { ...f, path: fullPath, id: fullPath } as QuestionBase,
                        value: getValueByPath(formState, fullPath),
                        updateField,
                        formState,
                        errors,
                        onEnter
                      })}
                    </div>
                  );
                })}

                {rows.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRow(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button size="sm" onClick={addRow}>
              + Add Another
            </Button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                         CONDITIONAL FIELD HANDLING                          */
  /* -------------------------------------------------------------------------- */

  const renderConditionalFields = () => {
    if (!question.conditional) return null;

    const conditionList = Array.isArray(question.conditional)
      ? question.conditional
      : [question.conditional];

    return conditionList.map((condition: ConditionalRule, condIndex: number) => {
      const triggers = Array.isArray(condition.triggerValue)
        ? condition.triggerValue
        : [condition.triggerValue];

      const shouldShow =
        question.type === "checkbox"
          ? triggers.some((t) => (value as string[])?.includes(t))
          : triggers.includes(value as string);

      if (!shouldShow) return null;

      return (
        <div key={condIndex}>
          {condition.fields.map((sub) => {
            const subPath = sub.path || question.path || "";

            return (
              <div key={sub.id} className="border-l pl-4 mt-4 space-y-1">
                {renderUserForm({
                  question: { ...sub, id: sub.id, path: subPath } as QuestionBase,
                  value: getValueByPath(formState, subPath),
                  updateField,
                  formState,
                  errors,
                  onEnter
                })}
              </div>
            );
          })}
        </div>
      );
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                  RENDER                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div key={question.id} className="mb-2">
      <label className="block font-medium mb-2">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderInput()}

      {renderConditionalFields()}

      {question.path && errors?.[question.path] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.path]}</p>
      )}

      {question.helperText && (
        <p className="text-xs text-gray-500 mt-2 whitespace-pre-line">
          {question.helperText}
        </p>
      )}
    </div>
  );
};

export function extractYouTubeHandle(url: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9._-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
