import subnet from "./subnet";

describe("subnet actions", () => {
  it("should handle fetching subnets", () => {
    expect(subnet.fetch()).toEqual({
      type: "FETCH_SUBNET",
      meta: {
        model: "subnet",
        method: "list"
      }
    });
  });
});
