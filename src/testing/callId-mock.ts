import * as reduxToolkit from "@reduxjs/toolkit";

import * as query from "@/app/store/machine/utils/query";

export const callId = "mocked-nanoid";

/**
 * Requires `@reduxjs/toolkit`'s `nanoid` to be mocked at the top level of the
 * test file (`vi.mock` is hoisted, so it can't be called from this function):
 * vi.mock("@reduxjs/toolkit", async () => ({
 *   ...(await vi.importActual<object>("@reduxjs/toolkit")),
 *   nanoid: vi.fn(),
 * }));
 */
export const enableCallIdMocks = (id = callId): void => {
  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue(id);
    vi.spyOn(reduxToolkit, "nanoid").mockReturnValue(id);
  });

  afterEach(() => {
    vi.spyOn(query, "generateCallId").mockRestore();
    vi.spyOn(reduxToolkit, "nanoid").mockRestore();
  });
};
