import repositories from "./repositories";

describe("repository actions", () => {
  it("should handle fetching repositories", () => {
    expect(repositories.fetch()).toEqual({
      type: "FETCH_REPOSITORIES",
      payload: {
        message: {
          method: "packagerepository.list",
          params: { limit: 50 },
          type: 0
        }
      }
    });
  });
});
