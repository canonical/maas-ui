import { general, generateGeneralReducer } from "./general";

describe("general reducer", () => {
  it("should return the initial state", () => {
    expect(general(undefined, {})).toEqual({
      architectures: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      componentsToDisable: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      defaultMinHweKernel: {
        data: "",
        errors: {},
        loaded: false,
        loading: false,
      },
      hweKernels: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      knownArchitectures: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      machineActions: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      navigationOptions: {
        data: {},
        errors: {},
        loaded: false,
        loading: false,
      },
      osInfo: {
        data: {},
        errors: {},
        loaded: false,
        loading: false,
      },
      pocketsToDisable: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      powerTypes: {
        data: [],
        errors: {},
        loaded: false,
        loading: false,
      },
      version: {
        data: "",
        errors: {},
        loaded: false,
        loading: false,
      },
    });
  });

  describe("generateGeneralReducer", () => {
    it("should correctly set initial data", () => {
      const initialData = [];
      const reducer = generateGeneralReducer("TYPE", initialData);
      expect(reducer(undefined, {})).toEqual({
        data: initialData,
        errors: {},
        loaded: false,
        loading: false,
      });
    });

    it("should correctly reduce FETCH_GENERAL_{THING}_START", () => {
      const reducer = generateGeneralReducer("THING", []);
      expect(reducer(undefined, { type: "FETCH_GENERAL_THING_START" })).toEqual(
        {
          data: [],
          errors: {},
          loaded: false,
          loading: true,
        }
      );
    });

    it("should correctly reduce FETCH_GENERAL_{THING}_SUCCESS", () => {
      const reducer = generateGeneralReducer("THING", "");
      expect(
        reducer(
          { data: "", errors: {}, loaded: false, loading: true },
          { type: "FETCH_GENERAL_THING_SUCCESS", payload: "payload" }
        )
      ).toEqual({
        data: "payload",
        errors: {},
        loaded: true,
        loading: false,
      });
    });

    it("should correctly reduce FETCH_GENERAL_{THING}_ERROR", () => {
      const reducer = generateGeneralReducer("THING", "");
      expect(
        reducer(
          { data: "", errors: {}, loaded: false, loading: true },
          { type: "FETCH_GENERAL_THING_ERROR", error: "error" }
        )
      ).toEqual({
        data: "",
        errors: "error",
        loaded: false,
        loading: false,
      });
    });
  });
});
