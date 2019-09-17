import scripts from "./scripts";

describe("scripts actions", () => {
  it("should handle fetching scripts", () => {
    expect(scripts.fetch()).toEqual({
      type: "FETCH_SCRIPTS"
    });
  });

  it("should handle uploading scripts", () => {
    expect(scripts.upload("script-1", "testing", "contents")).toEqual({
      type: "UPLOAD_SCRIPT",
      payload: {
        name: "script-1",
        type: "testing",
        contents: "contents"
      }
    });
  });

  it("can handle deleting scripts", () => {
    expect(scripts.delete({ id: 1, name: "script-1" })).toEqual({
      type: "DELETE_SCRIPT",
      payload: {
        id: 1,
        name: "script-1"
      }
    });
  });

  it("can handle cleaning scripts", () => {
    expect(scripts.cleanup()).toEqual({
      type: "CLEANUP_SCRIPTS"
    });
  });
});
