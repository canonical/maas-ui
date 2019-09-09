import scripts from "./scripts";

describe("scripts actions", () => {
  it("should handle fetching scripts", () => {
    expect(scripts.fetch()).toEqual({
      type: "FETCH_SCRIPTS"
    });
  });

  it("should handle uploading scripts", () => {
    expect(
      scripts.upload("title", "description", "testing", "contents")
    ).toEqual({
      type: "UPLOAD_SCRIPT",
      payload: {
        title: "title",
        description: "description",
        type: "testing",
        contents: "contents"
      }
    });
  });

  it("should handle scripts cleanup", () => {
    expect(scripts.cleanup()).toEqual({
      type: "CLEANUP_SCRIPTS"
    });
  });
});
