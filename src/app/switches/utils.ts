import type { BaseExceptionDetail } from "@/app/apiclient";

type SwitchApiError = {
  message?: string;
  details?: BaseExceptionDetail[];
};

export const getSwitchErrorMessage = (
  error?: SwitchApiError | null
): string | null => {
  if (!error) {
    return null;
  }
  if (error.details?.length) {
    return error.details.map((detail) => detail.message).join(" ");
  }
  return error.message ?? null;
};
