import domain from "./selectors";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("domain selectors", () => {
  it("can get all items", () => {
    const items = [domainFactory()];
    const state = rootStateFactory({
      domain: domainStateFactory({
        items,
      }),
    });
    expect(domain.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loading: true,
      }),
    });
    expect(domain.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
    });
    expect(domain.loaded(state)).toEqual(true);
  });

  it("can get a domain by name", () => {
    const items = [
      domainFactory({ name: "koala" }),
      domainFactory({ name: "kangaroo" }),
    ];
    const state = rootStateFactory({
      domain: domainStateFactory({
        items,
      }),
    });
    expect(domain.getByName(state, "kangaroo")).toEqual(items[1]);
  });

  it("can get the default domain", () => {
    const items = [
      domainFactory({ is_default: true }),
      domainFactory({ is_default: false }),
    ];
    const state = rootStateFactory({
      domain: domainStateFactory({
        items,
      }),
    });
    expect(domain.getDefault(state)).toEqual(items[0]);
  });
});
