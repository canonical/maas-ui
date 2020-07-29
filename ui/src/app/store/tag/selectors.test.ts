import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import tag from "./selectors";

describe("tag selectors", () => {
  it("can get all items", () => {
    const items = [tagFactory(), tagFactory()];
    const state = rootStateFactory({
      tag: tagStateFactory({
        items,
      }),
    });
    expect(tag.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      tag: tagStateFactory({
        loading: true,
      }),
    });
    expect(tag.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      tag: tagStateFactory({
        loaded: true,
      }),
    });
    expect(tag.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      tag: tagStateFactory({
        errors: "Data is incorrect",
      }),
    });
    expect(tag.errors(state)).toStrictEqual("Data is incorrect");
  });
});
