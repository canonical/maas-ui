import MESSAGE_TYPES from "app/base/constants";

import general from "./general";

describe("general actions", () => {
  it("should handle fetching osinfo", () => {
    expect(general.fetchOsInfo()).toEqual({
      type: "FETCH_GENERAL_OSINFO",
      meta: {
        model: "general",
        method: "osinfo",
        type: MESSAGE_TYPES.REQUEST
      }
    });
  });
});
