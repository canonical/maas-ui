import sshkey from "./sshkey";

describe("sshkey actions", () => {
  it("should handle fetching SSH keys", () => {
    expect(sshkey.fetch()).toEqual({
      type: "FETCH_SSHKEY",
      meta: {
        model: "sshkey",
        method: "list"
      }
    });
  });
});
