import powerTypes from "./powerTypes";

describe("powerTypes selectors", () => {
  describe("get", () => {
    it("returns powerTypes", () => {
      const data = [
        {
          driver_type: "power",
          name: "apc",
          description: "American Power Conversion (APC) PDU",
          fields: [
            {
              name: "power_address",
              label: "IP for APC PDU",
              required: true,
              field_type: "string",
              choices: [],
              default: "",
              scope: "bmc"
            },
            {
              name: "node_outlet",
              label: "APC PDU node outlet number (1-16)",
              required: true,
              field_type: "string",
              choices: [],
              default: "",
              scope: "node"
            },
            {
              name: "power_on_delay",
              label: "Power ON outlet delay (seconds)",
              required: false,
              field_type: "string",
              choices: [],
              default: "5",
              scope: "bmc"
            }
          ],
          missing_packages: [],
          queryable: false
        }
      ];
      const state = {
        general: {
          powerTypes: {
            data,
            errors: {},
            loaded: true,
            loading: false
          }
        }
      };
      expect(powerTypes.get(state)).toStrictEqual(data);
    });
  });

  describe("loading", () => {
    it("returns powerTypes loading state", () => {
      const loading = true;
      const state = {
        general: {
          powerTypes: {
            data: [],
            errors: {},
            loaded: false,
            loading
          }
        }
      };
      expect(powerTypes.loading(state)).toStrictEqual(loading);
    });
  });

  describe("loaded", () => {
    it("returns powerTypes loaded state", () => {
      const loaded = true;
      const state = {
        general: {
          powerTypes: {
            data: [],
            errors: {},
            loaded,
            loading: false
          }
        }
      };
      expect(powerTypes.loaded(state)).toStrictEqual(loaded);
    });
  });

  describe("errors", () => {
    it("returns powerTypes errors state", () => {
      const errors = "Cannot fetch powerTypes.";
      const state = {
        general: {
          powerTypes: {
            data: [],
            errors,
            loaded: true,
            loading: false
          }
        }
      };
      expect(powerTypes.errors(state)).toStrictEqual(errors);
    });
  });
});
