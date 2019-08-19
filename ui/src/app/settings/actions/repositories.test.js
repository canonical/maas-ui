import repositories from "./repositories";

describe("repository actions", () => {
  it("should handle fetching repositories", () => {
    expect(repositories.fetch()).toEqual({
      type: "FETCH_REPOSITORIES",
      payload: {
        params: { limit: 50 }
      },
      meta: {
        model: "repositories",
        method: "packagerepository.list",
        type: 0
      }
    });
  });
});
