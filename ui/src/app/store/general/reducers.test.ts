import reducers, { actions } from "./slice";

import {
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  generalState as generalStateFactory,
  generatedCertificate as certificateFactory,
  generatedCertificateState as generatedCertificateStateFactory,
} from "testing/factories";

describe("general reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      architectures: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      bondOptions: {
        data: null,
        errors: null,
        loaded: false,
        loading: false,
      },
      componentsToDisable: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      defaultMinHweKernel: {
        data: "",
        errors: null,
        loaded: false,
        loading: false,
      },
      generatedCertificate: {
        data: null,
        errors: null,
        loaded: false,
        loading: false,
      },
      hweKernels: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      knownArchitectures: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      knownBootArchitectures: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      machineActions: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      osInfo: {
        data: null,
        errors: null,
        loaded: false,
        loading: false,
      },
      pocketsToDisable: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      powerTypes: {
        data: [],
        errors: null,
        loaded: false,
        loading: false,
      },
      version: {
        data: "",
        errors: null,
        loaded: false,
        loading: false,
      },
    });
  });

  it("reduces fetchBondOptionsStart", () => {
    const initialState = generalStateFactory({
      bondOptions: bondOptionsStateFactory({ loading: false }),
    });
    expect(reducers(initialState, actions.fetchBondOptionsStart())).toEqual(
      generalStateFactory({
        bondOptions: bondOptionsStateFactory({ loading: true }),
      })
    );
  });

  it("reduces fetchBondOptionsSuccess", () => {
    const initialState = generalStateFactory({
      bondOptions: bondOptionsStateFactory({
        data: undefined,
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
        errors: null,
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

  it("reduces generateCertificateStart", () => {
    const initialState = generalStateFactory({
      generatedCertificate: generatedCertificateStateFactory({
        loading: false,
      }),
    });

    expect(reducers(initialState, actions.generateCertificateStart())).toEqual(
      generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          loading: true,
        }),
      })
    );
  });

  it("reduces generateCertificateSuccess", () => {
    const certificate = certificateFactory();
    const initialState = generalStateFactory({
      generatedCertificate: generatedCertificateStateFactory({
        data: null,
        loaded: false,
        loading: true,
      }),
    });

    expect(
      reducers(initialState, actions.generateCertificateSuccess(certificate))
    ).toEqual(
      generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: certificate,
          loaded: true,
          loading: false,
        }),
      })
    );
  });

  it("reduces generateCertificateError", () => {
    const initialState = generalStateFactory({
      generatedCertificate: generatedCertificateStateFactory({
        errors: null,
        loaded: false,
        loading: true,
      }),
    });

    expect(
      reducers(
        initialState,
        actions.generateCertificateError("Could not generate certificate")
      )
    ).toEqual(
      generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          errors: "Could not generate certificate",
          loaded: false,
          loading: false,
        }),
      })
    );
  });

  it("reduces clearGeneratedCertificate", () => {
    const initialState = generalStateFactory({
      generatedCertificate: generatedCertificateStateFactory({
        data: certificateFactory(),
        errors: "Uh oh",
        loaded: true,
        loading: true,
      }),
    });

    expect(reducers(initialState, actions.clearGeneratedCertificate())).toEqual(
      generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: null,
          errors: null,
          loaded: false,
          loading: false,
        }),
      })
    );
  });

  it("reduces cleanupGeneratedCertificateErrors", () => {
    const cert = certificateFactory();
    const initialState = generalStateFactory({
      generatedCertificate: generatedCertificateStateFactory({
        data: cert,
        errors: "Uh oh",
        loaded: true,
        loading: true,
      }),
    });

    expect(
      reducers(initialState, actions.cleanupGeneratedCertificateErrors())
    ).toEqual(
      generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: cert,
          errors: null,
          loaded: true,
          loading: true,
        }),
      })
    );
  });
});
