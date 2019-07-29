import repositories from "./repositories";

describe("repository actions", () => {
  it("should handle fetching repositories", () => {
    expect(repositories.fetch()).toEqual({
      type: "WEBSOCKET_SEND",
      payload: {
        actionType: "FETCH_REPOSITORIES",
        message: {
          method: "packagerepository.list",
          params: { limit: 50 },
          type: 0
        }
      }
    });
  });
});
