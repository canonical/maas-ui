import { actions } from "./slice";

describe("pod actions", () => {
  it("can create an action for fetching pods", () => {
    expect(actions.fetch()).toEqual({
      type: "pod/fetch",
      meta: {
        model: "pod",
        method: "list",
      },
    });
  });

  it("can create an action for creating a pod", () => {
    expect(actions.create({ name: "pod1", description: "a pod" })).toEqual({
      type: "pod/create",
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
    expect(actions.get(1)).toEqual({
      type: "pod/get",
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
    expect(actions.update({ name: "pod1", description: "a pod" })).toEqual({
      type: "pod/update",
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
    expect(actions.delete(1)).toEqual({
      type: "pod/delete",
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
    expect(actions.refresh(1)).toEqual({
      type: "pod/refresh",
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
    expect(actions.compose(params)).toEqual({
      type: "pod/compose",
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
    expect(actions.setSelected([1, 2, 4])).toEqual({
      type: "pod/setSelected",
      payload: [1, 2, 4],
    });
  });

  it("can create an action for pods cleanup", () => {
    expect(actions.cleanup()).toEqual({
      type: "pod/cleanup",
    });
  });
});
