import { nanoid } from "@reduxjs/toolkit";
import { vi } from "vitest";

import * as query from "@/app/store/machine/utils/query";

export const callId = "mocked-call-id";
export const mockedReduxToolkit = { nanoid };

export const enableCallIdMocks = (): void => {
  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue(callId);
    vi.spyOn(mockedReduxToolkit, "nanoid").mockReturnValue(callId);
  });

  afterEach(() => {
    vi.spyOn(query, "generateCallId").mockRestore();
    vi.spyOn(mockedReduxToolkit, "nanoid").mockRestore();
  });
};
