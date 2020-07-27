import pod from "./pod";

describe("pod actions", () => {
  it("can create an action for fetching pods", () => {
    expect(pod.fetch()).toEqual({
      type: "FETCH_POD",
      meta: {
        model: "pod",
        method: "list",
      },
    });
  });

  it("can create an action for creating a pod", () => {
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

  it("can create an action for getting a pod", () => {
    expect(pod.get(1)).toEqual({
      type: "GET_POD",
      meta: {
        model: "pod",
        method: "get",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can create an action for updating a pod", () => {
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

  it("can create an action for deleting a pod", () => {
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

  it("can create an action for refreshing a pod", () => {
    expect(pod.refresh(1)).toEqual({
      type: "REFRESH_POD",
      meta: {
        model: "pod",
        method: "refresh",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can create an action for composing a pod", () => {
    const params = { id: 1 };
    expect(pod.compose(params)).toEqual({
      type: "COMPOSE_POD",
      meta: {
        model: "pod",
        method: "compose",
      },
      payload: {
        params,
      },
    });
  });

  it("can create an action for selecting pods", () => {
    expect(pod.setSelected([1, 2, 4])).toEqual({
      type: "SET_SELECTED_PODS",
      payload: [1, 2, 4],
    });
  });

  it("can create an action for pods cleanup", () => {
    expect(pod.cleanup()).toEqual({
      type: "CLEANUP_POD",
    });
  });
});
