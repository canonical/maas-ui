import notification from "./notification";

describe("notification actions", () => {
  it("creates a delete action", () => {
    expect(notification.delete(2)).toEqual({
      type: "DELETE_NOTIFICATION",
      payload: {
        params: {
          id: 2
        }
      },
      meta: {
        method: "dismiss",
        model: "notification"
      }
    });
  });
});
