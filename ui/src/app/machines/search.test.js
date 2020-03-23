import {
  filtersToQueryString,
  filtersToString,
  getCurrentFilters,
  getEmptyFilter,
  isFilterActive,
  queryStringToFilters,
  retrieveFilters,
  storeFilters,
  toggleFilter
} from "./search";

describe("Search", () => {
  const scenarios = [
    {
      input: "",
      filters: {
        _: []
      }
    },
    {
      input: "moon",
      filters: {
        _: ["moon"]
      }
    },
    {
      input: "moon !sun",
      filters: {
        _: ["moon", "!sun"]
      }
    },
    {
      input: "moon !!sun",
      filters: {
        _: ["moon", "!!sun"]
      }
    },
    {
      input: "moon status:(new)",
      filters: {
        _: ["moon"],
        status: ["new"]
      }
    },
    {
      input: "moon status:(new) star",
      output: "moon star status:(new)",
      filters: {
        _: ["moon", "star"],
        status: ["new"]
      }
    },
    {
      input: "moon status:(new,deployed)",
      filters: {
        _: ["moon"],
        status: ["new", "deployed"]
      }
    },
    {
      input: "moon status:(new,failed disk erasing)",
      filters: {
        _: ["moon"],
        status: ["new", "failed disk erasing"]
      }
    },
    {
      input: "moon status:!(!new,failed disk erasing)",
      output: "moon status:(!!new,!failed disk erasing)",
      filters: {
        _: ["moon"],
        status: ["!!new", "!failed disk erasing"]
      }
    },
    {
      input: "moon status:!!(new,failed commissioning)",
      output: "moon status:(new,failed commissioning)",
      filters: {
        _: ["moon"],
        status: ["new", "failed commissioning"]
      }
    },
    {
      input: "moon status:!!(!new)",
      output: "moon status:(!new)",
      filters: {
        _: ["moon"],
        status: ["!new"]
      }
    },
    {
      input: "moon status:!!(!!new)",
      output: "moon status:(!!new)",
      filters: {
        _: ["moon"],
        status: ["!!new"]
      }
    },
    {
      input: "moon status:(new,failed disk erasing,pending)",
      filters: {
        _: ["moon"],
        status: ["new", "failed disk erasing", "pending"]
      }
    },
    {
      input: "moon status:new,deployed",
      output: "moon status:(new,deployed)",
      filters: {
        _: ["moon"],
        status: ["new", "deployed"]
      }
    },
    {
      input: "moon status:new,failed disk erasing",
      output: "moon disk erasing status:(new,failed)",
      filters: {
        _: ["moon", "disk", "erasing"],
        status: ["new", "failed"]
      }
    },
    {
      input: "moon status:(new,failed disk erasing",
      output: "moon disk erasing",
      filters: {
        _: ["moon", "disk", "erasing"]
      }
    },
    {
      input: "moon status:(",
      output: "moon",
      filters: {
        _: ["moon"]
      }
    },
    {
      input: "moon status:",
      output: "moon",
      filters: {
        _: ["moon"]
      }
    },
    {
      input: "moon mac:28:76:03:77:5a:b5 status:new",
      output: "moon mac:(28:76:03:77:5a:b5) status:(new)",
      filters: {
        _: ["moon"],
        mac: ["28:76:03:77:5a:b5"],
        status: ["new"]
      }
    },
    {
      input: "moon mac:(28:76:03:77:5a:b5) status:new",
      output: "moon mac:(28:76:03:77:5a:b5) status:(new)",
      filters: {
        _: ["moon"],
        mac: ["28:76:03:77:5a:b5"],
        status: ["new"]
      }
    },
    {
      input: "moon mac:(28:76:03:77:5a:b5,d6:4d:bc:0e:26:bc)",
      output: "moon mac:(28:76:03:77:5a:b5,d6:4d:bc:0e:26:bc)",
      filters: {
        _: ["moon"],
        mac: ["28:76:03:77:5a:b5", "d6:4d:bc:0e:26:bc"]
      }
    },
    {
      input: "moon status:(=new,!failed disk erasing,=!pending,!=deploying)",
      filters: {
        _: ["moon"],
        status: ["=new", "!failed disk erasing", "=!pending", "!=deploying"]
      }
    }
  ];

  scenarios.forEach(scenario => {
    describe("input:" + scenario.input, () => {
      it("getCurrentFilters", () => {
        expect(getCurrentFilters(scenario.input)).toEqual(scenario.filters);
      });

      it("filtersToString", () => {
        // Skip the ones with filters equal to null.
        if (!scenario.filters) {
          return;
        }

        expect(filtersToString(scenario.filters)).toEqual(
          scenario.output || scenario.input
        );
      });
    });
  });

  describe("isFilterActive", () => {
    it("returns false if type not in filter", () => {
      expect(isFilterActive({}, "type", "invalid")).toBe(false);
    });

    it("returns false if there are no filters", () => {
      expect(isFilterActive(null, "type", "invalid")).toBe(false);
    });

    it("returns false if value not in type", () => {
      expect(
        isFilterActive(
          {
            type: ["not"]
          },
          "type",
          "invalid"
        )
      ).toBe(false);
    });

    it("returns true if value in type", () => {
      expect(
        isFilterActive(
          {
            type: ["valid"]
          },
          "type",
          "valid"
        )
      ).toBe(true);
    });

    it("returns false if exact value not in type", () => {
      expect(
        isFilterActive(
          {
            type: ["valid"]
          },
          "type",
          "valid",
          true
        )
      ).toBe(false);
    });

    it("returns true if exact value in type", () => {
      expect(
        isFilterActive(
          {
            type: ["=valid"]
          },
          "type",
          "valid",
          true
        )
      ).toBe(true);
    });

    it("returns true if lowercase value in type", () => {
      expect(
        isFilterActive(
          {
            type: ["=Valid"]
          },
          "type",
          "valid",
          true
        )
      ).toBe(true);
    });
  });

  describe("toggleFilter", () => {
    it("adds type to filters", () => {
      expect(toggleFilter({}, "type", "value")).toEqual({
        type: ["value"]
      });
    });

    it("adds value to type in filters", () => {
      const filters = {
        type: ["exists"]
      };
      expect(toggleFilter(filters, "type", "value")).toEqual({
        type: ["exists", "value"]
      });
    });

    it("removes value to type in filters", () => {
      const filters = {
        type: ["exists", "value"]
      };
      expect(toggleFilter(filters, "type", "value")).toEqual({
        type: ["exists"]
      });
    });

    it("adds exact value to type in filters", () => {
      const filters = {
        type: ["exists"]
      };
      expect(toggleFilter(filters, "type", "value", true)).toEqual({
        type: ["exists", "=value"]
      });
    });

    it("removes exact value to type in filters", () => {
      const filters = {
        type: ["exists", "value", "=value"]
      };
      expect(toggleFilter(filters, "type", "value", true)).toEqual({
        type: ["exists", "value"]
      });
    });

    it("removes lowercase value to type in filters", () => {
      const filters = {
        type: ["exists", "=Value"]
      };
      expect(toggleFilter(filters, "type", "value", true)).toEqual({
        type: ["exists"]
      });
    });
  });

  describe("getEmptyFilter", () => {
    it("includes _ empty list", () => {
      expect(getEmptyFilter()).toEqual({ _: [] });
    });

    it("returns different object on each call", () => {
      const one = getEmptyFilter();
      const two = getEmptyFilter();
      expect(one).not.toBe(two);
    });
  });

  describe("storeFilters/retrieveFilters", () => {
    it("stores and retrieves the same object", () => {
      let i;
      const names = [];
      const objects = [];
      for (i = 0; i < 3; i++) {
        names.push(`name_${i}`);
        objects.push({});
      }
      names.forEach((name, idx) => {
        storeFilters(name, objects[idx]);
      });
      names.forEach((name, idx) => {
        expect(retrieveFilters(name)).toBe(objects[idx]);
      });
    });
  });

  describe("queryStringToFilters", () => {
    it("can convert a query string to a filter object", () => {
      expect(
        queryStringToFilters(
          "?q=moon+sun&status=new,failed+comissioning&zone=!south&hostname="
        )
      ).toEqual({
        _: ["moon", "sun"],
        status: ["new", "failed comissioning"],
        zone: ["!south"]
      });
    });

    it("can convert a query string to a filter object and back", () => {
      const queryString =
        "?status=new%2Cfailed+comissioning&zone=%21south&q=moon+sun";
      const queryObject = queryStringToFilters(queryString);
      expect(filtersToQueryString(queryObject)).toEqual(queryString);
    });
  });

  describe("filtersToQueryString", () => {
    it("can convert a filter object to a query string", () => {
      expect(
        filtersToQueryString({
          _: ["moon", "sun"],
          hostname: [],
          status: ["new", "failed comissioning"],
          zone: ["!south"]
        })
      ).toEqual("?status=new%2Cfailed+comissioning&zone=%21south&q=moon+sun");
    });

    it("can convert a filter object to a query string and back", () => {
      const queryObject = {
        _: ["moon", "sun"],
        status: ["new", "failed comissioning"],
        zone: ["!south"]
      };
      const queryString = filtersToQueryString(queryObject);
      expect(queryStringToFilters(queryString)).toEqual(queryObject);
    });
  });
});
