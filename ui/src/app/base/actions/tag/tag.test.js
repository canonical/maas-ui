import tag from "./tag";

describe("tag actions", () => {
  it("should handle fetching tags", () => {
    expect(tag.fetch()).toEqual({
      type: "FETCH_TAG",
      meta: {
        model: "tag",
        method: "list"
      }
    });
  });
});
