// lib/toast.ts
import { toast } from "sonner";

// Create a centralized function
export const showToast = (
  message: string,
  options?: Parameters<typeof toast>[1]
) => {
  toast(message, options);
};

// Optional: You can define shortcuts for success, error, etc.
export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastError = (message: string) => {
  toast.error(message);
};

export const toastInfo = (message: string) => {
  toast(message, { description: "Just so you know." });
};

export const handleToast = ({
  message,
  warning,
}: {
  message: string;
  warning: string;
}) => {
  if (message) {
    toastSuccess(message);
  }
  if (warning) {
    toastError(warning);
  }
};
