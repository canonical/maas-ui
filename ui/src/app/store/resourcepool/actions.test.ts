import { actions } from "./";

import {
  machine as machineFactory,
  resourcePool as resourcePoolFactory,
} from "testing/factories";

describe("resourcepool actions", () => {
  it("returns an action for fetching resource pools", () => {
    expect(actions.fetch()).toEqual({
      type: "resourcepool/fetch",
      meta: {
        model: "resourcepool",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns an action for creating resource pools", () => {
    expect(actions.create({ name: "pool1", description: "a pool" })).toEqual({
      type: "resourcepool/create",
      meta: {
        model: "resourcepool",
        method: "create",
      },
      payload: {
        params: {
          name: "pool1",
          description: "a pool",
        },
      },
    });
  });

  it("returns an action for updating resource pools", () => {
    expect(
      actions.update({ id: 1, name: "newName", description: "new description" })
    ).toEqual({
      type: "resourcepool/update",
      meta: {
        model: "resourcepool",
        method: "update",
      },
      payload: {
        params: {
          id: 1,
          name: "newName",
          description: "new description",
        },
      },
    });
  });

  it("returns an action for deleting resource pools", () => {
    expect(actions.delete(808)).toEqual({
      type: "resourcepool/delete",
      meta: {
        model: "resourcepool",
        method: "delete",
      },
      payload: {
        params: {
          id: 808,
        },
      },
    });
  });

  it("returns an action for cleaning resource pools", () => {
    expect(actions.cleanup()).toEqual({
      type: "resourcepool/cleanup",
    });
  });

  it("returns an action for creating resource pools with machines", () => {
    const pool = resourcePoolFactory({ name: "pool1" });
    const machines = [machineFactory(), machineFactory()];
    expect(actions.createWithMachines(pool, machines)).toEqual({
      type: "resourcepool/createWithMachines",
      payload: {
        params: {
          pool,
          machines,
        },
      },
    });
  });
});
