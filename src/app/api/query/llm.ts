import { useMutation } from "@tanstack/react-query";

import { mutationOptionsWithHeaders } from "@/app/api/utils";
import type {
  LlmSearchData,
  LlmSearchErrors,
  LlmSearchResponses,
  Options,
} from "@/app/apiclient";
import { llmSearch } from "@/app/apiclient";

export const useLlmSearch = (mutationOptions?: Options<LlmSearchData>) => {
  return useMutation({
    ...mutationOptionsWithHeaders<
      LlmSearchResponses,
      LlmSearchErrors,
      LlmSearchData
    >(mutationOptions, llmSearch),
  });
};
