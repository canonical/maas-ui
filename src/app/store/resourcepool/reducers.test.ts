import reducers, { actions } from "./slice";

import * as factory from "@/testing/factories";

describe("resourcePool reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  describe("fetch", () => {
    it("reduces fetch", () => {
      expect(reducers(undefined, actions.fetchStart())).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: true,
        saved: false,
        saving: false,
      });
    });

    it("reduces fetchSuccess", () => {
      const resourcePoolState = factory.resourcePoolState({
        items: [],
        loading: true,
      });
      const resourcePools = [factory.resourcePool()];
      expect(
        reducers(resourcePoolState, actions.fetchSuccess(resourcePools))
      ).toEqual({
        errors: {},
        items: resourcePools,
        loading: false,
        loaded: true,
        saved: false,
        saving: false,
      });
    });

    it("reduces fetchError", () => {
      const resourcePoolState = factory.resourcePoolState();
      expect(
        reducers(
          resourcePoolState,
          actions.fetchError("Could not fetch resource pools")
        )
      ).toEqual({
        errors: "Could not fetch resource pools",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const resourcePoolState = factory.resourcePoolState({ saved: true });
      expect(reducers(resourcePoolState, actions.createStart())).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      });
    });

    it("reduces createError", () => {
      const resourcePoolState = factory.resourcePoolState({ saving: true });
      expect(
        reducers(
          resourcePoolState,
          actions.createError({ name: "name already exists" })
        )
      ).toEqual({
        errors: { name: "name already exists" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces createNotify", () => {
      const resourcePools = [factory.resourcePool({ id: 1 })];
      const newResourcePool = factory.resourcePool({ id: 2 });
      const resourcePoolState = factory.resourcePoolState({
        items: resourcePools,
      });

      expect(
        reducers(resourcePoolState, actions.createNotify(newResourcePool))
      ).toEqual({
        errors: {},
        items: [...resourcePools, newResourcePool],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const resourcePoolState = factory.resourcePoolState({ saved: true });

      expect(reducers(resourcePoolState, actions.updateStart())).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      });
    });

    it("reduces updateSuccess", () => {
      const resourcePoolState = factory.resourcePoolState({
        saving: true,
      });

      expect(reducers(resourcePoolState, actions.updateSuccess())).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: true,
        saving: false,
      });
    });

    it("reduces updateError", () => {
      const resourcePoolState = factory.resourcePoolState({
        saving: true,
      });

      expect(
        reducers(
          resourcePoolState,
          actions.updateError("Could not update resource pool")
        )
      ).toEqual({
        errors: "Could not update resource pool",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces updateNotify", () => {
      const resourcePools = [factory.resourcePool({ id: 1 })];
      const updatedResourcePool = factory.resourcePool({
        id: 1,
        name: "newName",
        description: "newDescription",
      });

      const resourcePoolState = factory.resourcePoolState({
        items: resourcePools,
      });

      expect(
        reducers(resourcePoolState, actions.updateNotify(updatedResourcePool))
      ).toEqual({
        errors: {},
        items: [updatedResourcePool],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const resourcePools = [factory.resourcePool({ id: 1 })];
      const resourcePoolState = factory.resourcePoolState({
        items: resourcePools,
      });

      expect(reducers(resourcePoolState, actions.deleteStart())).toEqual({
        errors: {},
        items: resourcePools,
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      });
    });

    it("reduces deleteSuccess", () => {
      const resourcePools = [factory.resourcePool({ id: 1 })];
      const resourcePoolState = factory.resourcePoolState({
        items: resourcePools,
      });

      expect(reducers(resourcePoolState, actions.deleteSuccess())).toEqual({
        errors: null,
        items: resourcePools,
        loaded: false,
        loading: false,
        saved: true,
        saving: false,
      });
    });

    it("reduces deleteError", () => {
      const resourcePools = [factory.resourcePool({ id: 1 })];
      const resourcePoolState = factory.resourcePoolState({
        items: resourcePools,
      });

      expect(
        reducers(
          resourcePoolState,
          actions.deleteError("Resource pool cannot be deleted")
        )
      ).toEqual({
        errors: "Resource pool cannot be deleted",
        items: resourcePools,
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces deleteNotify", () => {
      const resourcePools = [
        factory.resourcePool({ id: 1 }),
        factory.resourcePool({ id: 2 }),
      ];
      const resourcePoolState = factory.resourcePoolState({
        items: resourcePools,
      });

      expect(reducers(resourcePoolState, actions.deleteNotify(1))).toEqual({
        errors: {},
        items: [resourcePools[1]],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("misc", () => {
    it("reduces cleanup", () => {
      expect(
        reducers(
          {
            errors: { name: "Name already exists" },
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: true,
          },
          actions.cleanup()
        )
      ).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces createWithMachines", () => {
      expect(
        reducers(
          {
            errors: { name: "Name already exists" },
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: true,
          },
          actions.createWithMachines({
            pool: factory.resourcePool(),
            machineIDs: ["abc123"],
          })
        )
      ).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: true,
        saving: true,
      });
    });
  });
});
