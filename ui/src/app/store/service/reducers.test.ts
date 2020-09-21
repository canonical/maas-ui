import {
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("service reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(serviceStateFactory());
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = serviceStateFactory({ loading: false });

      expect(reducers(initialState, actions.fetchStart())).toEqual(
        serviceStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = serviceStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const services = [serviceFactory(), serviceFactory()];

      expect(reducers(initialState, actions.fetchSuccess(services))).toEqual(
        serviceStateFactory({
          items: services,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = serviceStateFactory({
        errors: null,
        loading: true,
      });

      expect(
        reducers(initialState, actions.fetchError("Could not fetch services"))
      ).toEqual(
        serviceStateFactory({
          errors: "Could not fetch services",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = serviceStateFactory({ saving: false });

      expect(reducers(initialState, actions.createStart())).toEqual(
        serviceStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = serviceStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.createSuccess())).toEqual(
        serviceStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = serviceStateFactory({
        items: [serviceFactory()],
      });
      const newService = serviceFactory();

      expect(reducers(initialState, actions.createNotify(newService))).toEqual(
        serviceStateFactory({
          items: [...initialState.items, newService],
        })
      );
    });

    it("reduces createError", () => {
      const initialState = serviceStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(initialState, actions.createError("Could not create service"))
      ).toEqual(
        serviceStateFactory({
          errors: "Could not create service",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = serviceStateFactory({ saving: false });

      expect(reducers(initialState, actions.updateStart())).toEqual(
        serviceStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = serviceStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        serviceStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = serviceStateFactory({
        items: [serviceFactory()],
      });
      const updatedService = serviceFactory({
        id: initialState.items[0].id,
        name: "updated-reducers",
      });

      expect(
        reducers(initialState, actions.updateNotify(updatedService))
      ).toEqual(serviceStateFactory({ items: [updatedService] }));
    });

    it("reduces updateError", () => {
      const initialState = serviceStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(initialState, actions.updateError("Could not update service"))
      ).toEqual(
        serviceStateFactory({
          errors: "Could not update service",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = serviceStateFactory({ saving: false });

      expect(reducers(initialState, actions.deleteStart())).toEqual(
        serviceStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = serviceStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        serviceStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteService, keepService] = [serviceFactory(), serviceFactory()];
      const initialState = serviceStateFactory({
        items: [deleteService, keepService],
      });

      expect(
        reducers(initialState, actions.deleteNotify(deleteService.id))
      ).toEqual(serviceStateFactory({ items: [keepService] }));
    });

    it("reduces deleteError", () => {
      const initialState = serviceStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(initialState, actions.deleteError("Could not delete service"))
      ).toEqual(
        serviceStateFactory({
          errors: "Could not delete service",
          saving: false,
        })
      );
    });
  });
});
