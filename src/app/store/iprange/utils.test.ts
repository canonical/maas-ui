import { IPRangeType } from "./types";
import {
  getCommentDisplay,
  getOwnerDisplay,
  getTypeDisplay,
  isDynamic,
} from "./utils";

import { ipRange as ipRangeFactory } from "testing/factories";

describe("isDynamic", () => {
  it("returns whether an IP range is dynamic", () => {
    const dynamicIP = ipRangeFactory({ type: IPRangeType.Dynamic });
    const reservedIP = ipRangeFactory({ type: IPRangeType.Reserved });

    expect(isDynamic(dynamicIP)).toBe(true);
    expect(isDynamic(reservedIP)).toBe(false);
  });
});

describe("getCommentDisplay", () => {
  it("correctly formats an IP range's comment", () => {
    const dynamicIP = ipRangeFactory({
      comment: "something",
      type: IPRangeType.Dynamic,
    });
    const reservedIP = ipRangeFactory({
      comment: "something",
      type: IPRangeType.Reserved,
    });

    expect(getCommentDisplay(dynamicIP)).toBe("Dynamic");
    expect(getCommentDisplay(reservedIP)).toBe("something");
  });
});

describe("getOwnerDisplay", () => {
  it("correctly formats an IP range's owner", () => {
    const dynamicIP = ipRangeFactory({
      type: IPRangeType.Dynamic,
      user: "user",
    });
    const reservedIP = ipRangeFactory({
      type: IPRangeType.Reserved,
      user: "user",
    });

    expect(getOwnerDisplay(dynamicIP)).toBe("MAAS");
    expect(getOwnerDisplay(reservedIP)).toBe("user");
  });
});

describe("getTypeDisplay", () => {
  it("correctly formats an IP range's type", () => {
    const dynamicIP = ipRangeFactory({
      type: IPRangeType.Dynamic,
    });
    const reservedIP = ipRangeFactory({
      type: IPRangeType.Reserved,
    });

    expect(getTypeDisplay(dynamicIP)).toBe("Dynamic");
    expect(getTypeDisplay(reservedIP)).toBe("Reserved");
  });
});
