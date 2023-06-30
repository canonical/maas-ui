import reduxToolkit from "@reduxjs/toolkit";

import * as query from "app/store/machine/utils/query";

export const callId = "mocked-call-id";

export const enableCallIdMocks = (): void => {
  beforeEach(() => {
    jest.spyOn(query, "generateCallId").mockReturnValue(callId);
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue(callId);
  });

  afterEach(() => {
    jest.spyOn(query, "generateCallId").mockRestore();
    jest.spyOn(reduxToolkit, "nanoid").mockRestore();
  });
};
