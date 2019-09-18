import tag from "./tag";

describe("tag selectors", () => {
  it("can get all items", () => {
    const items = [
      {
        id: 1,
        created: "Mon, 16 Sep. 2019 12:22:36",
        updated: "Mon, 16 Sep. 2019 12:22:36",
        name: "virtual",
        definition: "",
        comment: "",
        kernel_opts: null
      }
    ];
    const state = {
      tag: {
        items
      }
    };
    expect(tag.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = {
      tag: {
        loading: true,
        items: []
      }
    };
    expect(tag.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      tag: {
        loaded: true,
        items: []
      }
    };
    expect(tag.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = {
      tag: {
        errors: "Data is incorrect"
      }
    };
    expect(tag.errors(state)).toStrictEqual("Data is incorrect");
  });
});
