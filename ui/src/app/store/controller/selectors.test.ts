import controller from "./selectors";

import {
  rootState as rootStateFactory,
  controller as controllerFactory,
  controllerState as controllerStateFactory,
} from "testing/factories";

describe("controller selectors", () => {
  it("can get all items", () => {
    const items = [controllerFactory(), controllerFactory()];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items,
      }),
    });
    expect(controller.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        loading: true,
      }),
    });
    expect(controller.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
      }),
    });
    expect(controller.loaded(state)).toEqual(true);
  });

  it("can get a controller by id", () => {
    const items = [
      controllerFactory({ system_id: "808" }),
      controllerFactory({ system_id: "909" }),
    ];
    const state = rootStateFactory({
      controller: controllerStateFactory({
        items,
      }),
    });
    expect(controller.getById(state, "909")).toStrictEqual(items[1]);
  });
});
