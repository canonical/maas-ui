import repositories from "./repositories";

describe("repository actions", () => {
  it("should handle fetching repositories", () => {
    expect(repositories.fetch()).toEqual({
      type: "FETCH_PACKAGEREPOSITORY",
      payload: {
        params: { limit: 50 }
      },
      meta: {
        model: "packagerepository",
        method: "list",
        type: 0
      }
    });
  });

  it("can handle deleting repositories", () => {
    expect(repositories.delete(911)).toEqual({
      type: "DELETE_PACKAGEREPOSITORY",
      meta: {
        model: "packagerepository",
        method: "delete",
        type: 0
      },
      payload: {
        params: {
          id: 911
        }
      }
    });
  });
});
