import { generatePayloadParams } from "./generatePayloadParams";

describe("generatePayloadParams", () => {
  it("removes undefined values", () => {
    expect(
      generatePayloadParams({
        id: 0,
        name: undefined,
        emailAddress: null,
      })
    ).toStrictEqual({
      id: 0,
      emailAddress: null,
    });
  });

  it("can map params to different key names", () => {
    expect(
      generatePayloadParams(
        {
          id: 1,
          name: "Wallaby",
        },
        { name: "username" }
      )
    ).toStrictEqual({ id: 1, username: "Wallaby" });
  });
});
