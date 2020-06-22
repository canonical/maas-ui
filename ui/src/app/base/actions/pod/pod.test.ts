import pod from "./pod";

describe("pod actions", () => {
  it("should handle fetching pods", () => {
    expect(pod.fetch()).toEqual({
      type: "FETCH_POD",
      meta: {
        model: "pod",
        method: "list",
      },
    });
  });

  it("can handle creating pods", () => {
    expect(pod.create({ name: "pod1", description: "a pod" })).toEqual({
      type: "CREATE_POD",
      meta: {
        model: "pod",
        method: "create",
      },
      payload: {
        params: {
          name: "pod1",
          description: "a pod",
        },
      },
    });
  });

  it("can handle updating pods", () => {
    expect(pod.update({ name: "pod1", description: "a pod" })).toEqual({
      type: "UPDATE_POD",
      meta: {
        model: "pod",
        method: "update",
      },
      payload: {
        params: {
          name: "pod1",
          description: "a pod",
        },
      },
    });
  });

  it("can handle deleting pods", () => {
    expect(pod.delete(1)).toEqual({
      type: "DELETE_POD",
      meta: {
        model: "pod",
        method: "delete",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can handle selecting pods", () => {
    expect(pod.setSelected([1, 2, 4])).toEqual({
      type: "SET_SELECTED_PODS",
      payload: [1, 2, 4],
    });
  });

  it("can handle cleaning pods", () => {
    expect(pod.cleanup()).toEqual({
      type: "CLEANUP_POD",
    });
  });
});
