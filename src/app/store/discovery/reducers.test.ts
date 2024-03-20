import reducers, { actions } from "./slice";

import * as factory from "@/testing/factories";

describe("discovery reducers", () => {
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

  it("reduces fetchStart", () => {
    const initialState = factory.discoveryState({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      factory.discoveryState({ loading: true })
    );
  });

  it("reduces fetchSuccess", () => {
    const discoveries = [factory.discovery()];
    const initialState = factory.discoveryState({
      items: [],
      loading: true,
    });
    expect(reducers(initialState, actions.fetchSuccess(discoveries))).toEqual(
      factory.discoveryState({
        loading: false,
        loaded: true,
        items: discoveries,
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = factory.discoveryState({ errors: null });
    expect(
      reducers(initialState, actions.fetchError("Could not fetch discoveries"))
    ).toEqual(
      factory.discoveryState({
        errors: "Could not fetch discoveries",
      })
    );
  });

  it("reduces deleteStart", () => {
    const initialState = factory.discoveryState({ saved: true, saving: false });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      factory.discoveryState({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const [deleteDiscovery, keepDiscovery] = [
      factory.discovery({
        ip: "192.168.1.1",
        mac_address: "00:00:00:00:00:00",
      }),
      factory.discovery({
        ip: "172.0.0.1",
        mac_address: "12:34:56:78:90:12",
      }),
    ];
    const initialState = factory.discoveryState({
      items: [deleteDiscovery, keepDiscovery],
      saved: false,
      saving: true,
    });
    expect(
      reducers(
        initialState,
        actions.deleteSuccess({
          ip: deleteDiscovery.ip,
          mac: deleteDiscovery.mac_address,
        })
      )
    ).toStrictEqual(
      factory.discoveryState({
        items: [keepDiscovery],
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteError", () => {
    const discoveries = [
      factory.discovery({
        ip: "192.168.1.1",
        mac_address: "00:00:00:00:00:00",
      }),
    ];
    const initialState = factory.discoveryState({
      errors: null,
      items: discoveries,
      saved: false,
      saving: true,
    });
    expect(
      reducers(initialState, actions.deleteError("Could not delete discovery"))
    ).toEqual(
      factory.discoveryState({
        errors: "Could not delete discovery",
        items: discoveries,
        saved: false,
        saving: false,
      })
    );
  });

  it("reduces clearStart", () => {
    const initialState = factory.discoveryState({ saved: true, saving: false });
    expect(reducers(initialState, actions.clearStart())).toEqual(
      factory.discoveryState({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces clearSuccess", () => {
    const discoveries = [factory.discovery(), factory.discovery()];
    const initialState = factory.discoveryState({
      items: discoveries,
      saved: false,
      saving: true,
    });
    expect(reducers(initialState, actions.clearSuccess())).toEqual(
      factory.discoveryState({
        items: [],
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces clearError", () => {
    const discoveries = [factory.discovery(), factory.discovery()];
    const initialState = factory.discoveryState({
      errors: null,
      items: discoveries,
      saved: false,
      saving: true,
    });
    expect(
      reducers(initialState, actions.clearError("Could not clear discoveries"))
    ).toEqual(
      factory.discoveryState({
        errors: "Could not clear discoveries",
        items: discoveries,
        saved: false,
        saving: false,
      })
    );
  });
});
