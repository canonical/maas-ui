import {
  domain as domainFactory,
  domainState as domainStateFactory,
} from "testing/factories";
import domain from "./selectors";

describe("domain selectors", () => {
  it("can get all items", () => {
    const items = [domainFactory()];
    const state = {
      domain: domainStateFactory({
        items,
      }),
    };
    expect(domain.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = {
      domain: {
        loading: true,
        items: [],
      },
    };
    expect(domain.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      domain: {
        loaded: true,
        items: [],
      },
    };
    expect(domain.loaded(state)).toEqual(true);
  });
});
