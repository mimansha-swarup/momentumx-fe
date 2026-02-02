/**
 * Application-wide constants and configuration values
 */

// Timing constants (in milliseconds)
export const HEALTH_CHECK_INTERVAL_MS = 13 * 60 * 1000; // 13 minutes
export const SUBMIT_SUCCESS_DELAY_MS = 2000;
export const SCRIPT_GENERATION_DELAY_MS = 3000;

// Content limits
export const MARKDOWN_PREVIEW_LIMIT = 300;

// Onboarding progress gradient colors by section index
export const PROGRESS_GRADIENT: Record<number, string> = {
  0: "bg-gradient-to-br from-indigo-600 to-violet-600",
  1: "bg-gradient-to-br from-blue-600 to-cyan-500",
  2: "bg-gradient-to-br from-teal-500 to-emerald-400",
  3: "bg-gradient-to-br from-amber-500 to-orange-500",
  4: "bg-gradient-to-br from-purple-500 to-pink-500",
};
