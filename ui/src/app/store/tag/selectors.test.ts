import {
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import tag from "./selectors";

describe("tag selectors", () => {
  it("can get all items", () => {
    const items = [tagFactory(), tagFactory()];
    const state = {
      tag: tagStateFactory({
        items,
      }),
    };
    expect(tag.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state: TSFixMe = {
      tag: {
        loading: true,
        items: [],
      },
    };
    expect(tag.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state: TSFixMe = {
      tag: {
        loaded: true,
        items: [],
      },
    };
    expect(tag.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state: TSFixMe = {
      tag: {
        errors: "Data is incorrect",
      },
    };
    expect(tag.errors(state)).toStrictEqual("Data is incorrect");
  });
});
