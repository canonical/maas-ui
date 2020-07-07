import {
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";
import service from "./service";

describe("service selectors", () => {
  it("can get all items", () => {
    const items = [serviceFactory(), serviceFactory()];
    const state = {
      service: serviceStateFactory({
        items,
      }),
    };
    expect(service.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = {
      service: {
        loading: true,
        items: [],
      },
    };
    expect(service.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      service: {
        loaded: true,
        items: [],
      },
    };
    expect(service.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = {
      service: {
        errors: "Data is incorrect",
      },
    };
    expect(service.errors(state)).toStrictEqual("Data is incorrect");
  });
});
