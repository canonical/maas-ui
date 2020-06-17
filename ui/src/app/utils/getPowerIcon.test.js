import { getPowerIcon } from "./getPowerIcon";

describe("getPowerIcon", () => {
  it("correctly returns on icon", () => {
    expect(getPowerIcon({ power_state: "on" })).toEqual("p-icon--power-on");
  });

  it("correctly returns off icon", () => {
    expect(getPowerIcon({ power_state: "off" })).toEqual("p-icon--power-off");
  });

  it("correctly returns error icon", () => {
    expect(getPowerIcon({ power_state: "error" })).toEqual(
      "p-icon--power-error"
    );
  });

  it("correctly returns unknown icon", () => {
    expect(getPowerIcon({ power_state: "unknown" })).toEqual(
      "p-icon--power-unknown"
    );
    expect(getPowerIcon()).toEqual("p-icon--power-unknown");
  });

  it("correctly returns loading icon", () => {
    expect(getPowerIcon(undefined, true)).toEqual(
      "p-icon--spinner u-animation--spin"
    );
  });
});
