import configuration from "./configuration";

describe("status", () => {
  it("should return the initialState", () => {
    expect(configuration(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_CONFIGURATION_START", () => {
    expect(
      configuration(undefined, {
        type: "FETCH_CONFIGURATION_START"
      })
    ).toEqual({
      loading: true,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_CONFIGURATION_SUCCESS", () => {
    expect(
      configuration(
        {
          loading: true,
          loaded: false,
          items: []
        },
        {
          type: "FETCH_CONFIGURATION_SUCCESS",
          payload: [
            { name: "boot_images_no_proxy", value: false },
            { name: "enable_third_party_drivers", value: true }
          ]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [
        { name: "boot_images_no_proxy", value: false },
        { name: "enable_third_party_drivers", value: true }
      ]
    });
  });
});
