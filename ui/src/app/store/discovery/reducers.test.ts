import reducers, { actions } from "./slice";

import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
} from "testing/factories";

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
    const initialState = discoveryStateFactory({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      discoveryStateFactory({ loading: true })
    );
  });

  it("reduces fetchSuccess", () => {
    const discoveries = [discoveryFactory()];
    const initialState = discoveryStateFactory({
      items: [],
      loading: true,
    });
    expect(reducers(initialState, actions.fetchSuccess(discoveries))).toEqual(
      discoveryStateFactory({
        loading: false,
        loaded: true,
        items: discoveries,
      })
    );
  });

  it("reduces fetchError", () => {
    const initialState = discoveryStateFactory({ errors: null });
    expect(
      reducers(initialState, actions.fetchError("Could not fetch discoveries"))
    ).toEqual(
      discoveryStateFactory({
        errors: "Could not fetch discoveries",
      })
    );
  });

  it("reduces deleteStart", () => {
    const initialState = discoveryStateFactory({ saved: true, saving: false });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      discoveryStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const [deleteDiscovery, keepDiscovery] = [
      discoveryFactory({
        ip: "192.168.1.1",
        mac_address: "00:00:00:00:00:00",
      }),
      discoveryFactory({
        ip: "172.0.0.1",
        mac_address: "12:34:56:78:90:12",
      }),
    ];
    const initialState = discoveryStateFactory({
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
      discoveryStateFactory({
        items: [keepDiscovery],
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteError", () => {
    const discoveries = [
      discoveryFactory({
        ip: "192.168.1.1",
        mac_address: "00:00:00:00:00:00",
      }),
    ];
    const initialState = discoveryStateFactory({
      errors: null,
      items: discoveries,
      saved: false,
      saving: true,
    });
    expect(
      reducers(initialState, actions.deleteError("Could not delete discovery"))
    ).toEqual(
      discoveryStateFactory({
        errors: "Could not delete discovery",
        items: discoveries,
        saved: false,
        saving: false,
      })
    );
  });

  it("reduces clearStart", () => {
    const initialState = discoveryStateFactory({ saved: true, saving: false });
    expect(reducers(initialState, actions.clearStart())).toEqual(
      discoveryStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces clearSuccess", () => {
    const discoveries = [discoveryFactory(), discoveryFactory()];
    const initialState = discoveryStateFactory({
      items: discoveries,
      saved: false,
      saving: true,
    });
    expect(reducers(initialState, actions.clearSuccess())).toEqual(
      discoveryStateFactory({
        items: [],
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces clearError", () => {
    const discoveries = [discoveryFactory(), discoveryFactory()];
    const initialState = discoveryStateFactory({
      errors: null,
      items: discoveries,
      saved: false,
      saving: true,
    });
    expect(
      reducers(initialState, actions.clearError("Could not clear discoveries"))
    ).toEqual(
      discoveryStateFactory({
        errors: "Could not clear discoveries",
        items: discoveries,
        saved: false,
        saving: false,
      })
    );
  });
});
