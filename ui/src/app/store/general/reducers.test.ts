import reducers, { actions } from "./slice";

import {
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  generalState as generalStateFactory,
} from "testing/factories";

describe("general reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      architectures: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      bondOptions: {
        data: null,
        errors: {},
        loaded: false,
        loading: false,
      },
      componentsToDisable: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      defaultMinHweKernel: {
        data: "",
        errors: {},
        loaded: false,
        loading: false,
      },
      hweKernels: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      knownArchitectures: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      machineActions: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      navigationOptions: {
        data: null,
        errors: {},
        loaded: false,
        loading: false,
      },
      osInfo: {
        data: null,
        errors: {},
        loaded: false,
        loading: false,
      },
      pocketsToDisable: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      powerTypes: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      version: {
        data: "",
        errors: {},
        loaded: false,
        loading: false,
      },
    });
  });

  it("reduces fetchBondOptionsStart", () => {
    const initialState = generalStateFactory({
      bondOptions: bondOptionsStateFactory({ loading: false }),
    });
    expect(reducers(initialState, actions.fetchBondOptionsStart(null))).toEqual(
      generalStateFactory({
        bondOptions: bondOptionsStateFactory({ loading: true }),
      })
    );
  });

  it("reduces fetchBondOptionsSuccess", () => {
    const initialState = generalStateFactory({
      bondOptions: bondOptionsStateFactory({
        data: null,
        loading: true,
        loaded: false,
      }),
    });
    const fetchedBondOptions = bondOptionsFactory();
    expect(
      reducers(
        initialState,
        actions.fetchBondOptionsSuccess(fetchedBondOptions)
      )
    ).toEqual(
      generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: fetchedBondOptions,
          loading: false,
          loaded: true,
        }),
      })
    );
  });

  it("reduces fetchBondOptionsError", () => {
    const initialState = generalStateFactory({
      bondOptions: bondOptionsStateFactory({
        errors: {},
        loaded: false,
        loading: true,
      }),
    });

    expect(
      reducers(
        initialState,
        actions.fetchBondOptionsError("Could not fetch bond options")
      )
    ).toEqual(
      generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          errors: "Could not fetch bond options",
          loaded: false,
          loading: false,
        }),
      })
    );
  });
});
