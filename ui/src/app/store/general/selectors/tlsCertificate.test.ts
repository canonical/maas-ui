import tlsCertificate from "./tlsCertificate";

import {
  generalState as generalStateFactory,
  tlsCertificate as tlsCertificateFactory,
  tlsCertificateState as tlsCertificateStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("get", () => {
  it("returns tlsCertificate", () => {
    const data = tlsCertificateFactory();
    const state = rootStateFactory({
      general: generalStateFactory({
        tlsCertificate: tlsCertificateStateFactory({
          data,
        }),
      }),
    });
    expect(tlsCertificate.get(state)).toStrictEqual(data);
  });
});

describe("loading", () => {
  it("returns tlsCertificate loading state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        tlsCertificate: tlsCertificateStateFactory({
          loading: true,
        }),
      }),
    });
    expect(tlsCertificate.loading(state)).toStrictEqual(true);
  });
});

describe("loaded", () => {
  it("returns tlsCertificate loaded state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        tlsCertificate: tlsCertificateStateFactory({
          loaded: true,
        }),
      }),
    });
    expect(tlsCertificate.loaded(state)).toStrictEqual(true);
  });
});

describe("errors", () => {
  it("returns tlsCertificate errors state", () => {
    const errors = "Cannot fetch TLS certificate";
    const state = rootStateFactory({
      general: generalStateFactory({
        tlsCertificate: tlsCertificateStateFactory({
          errors,
        }),
      }),
    });
    expect(tlsCertificate.errors(state)).toStrictEqual(errors);
  });
});
