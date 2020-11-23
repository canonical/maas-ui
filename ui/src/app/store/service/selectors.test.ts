import service from "./selectors";

import {
  rootState as rootStateFactory,
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";

describe("service selectors", () => {
  it("can get all items", () => {
    const items = [serviceFactory(), serviceFactory()];
    const state = rootStateFactory({
      service: serviceStateFactory({
        items,
      }),
    });
    expect(service.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      service: serviceStateFactory({
        loading: true,
      }),
    });
    expect(service.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      service: serviceStateFactory({
        loaded: true,
      }),
    });
    expect(service.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      service: serviceStateFactory({
        errors: "Data is incorrect",
      }),
    });
    expect(service.errors(state)).toStrictEqual("Data is incorrect");
  });
});
