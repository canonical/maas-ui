export const WORKLOAD_FILTER_PREFIX = "workload-";

// Holds all stored filters.
const storedFilters = {};

// Return a new empty filter;
export const getEmptyFilter = () => ({
  // "q" is for free search, i.e. not a specific machine attribute. "q" has
  // been chosen because it shouldn't conflict with any machine attributes and
  // also is the key name in the search URL query params.
  q: [],
});

// Return all of the currently active filters for the given search.
export const getCurrentFilters = (search) => {
  const filters = getEmptyFilter();
  if (!search) {
    return filters;
  }
  // Match filters with parens e.g. 'status:(new,deployed)'.
  // Then: match filters without parens e.g. 'status:new,deployed' or 'status'
  const filterMatchingRegex = search.matchAll(
    /(\b[\w-]+:!*\([^)]+\))|(!*\w+\S*)/g
  );
  [...filterMatchingRegex].forEach(([group]) => {
    // Get the filter name and values (if supplied).
    let [groupName, groupValues] = group.split(/:(.+)/);
    if (groupValues) {
      const allNegated = groupValues.startsWith("!(");
      if (allNegated) {
        // Remove the "!"
        groupValues = groupValues.substr(1);
      } else if (groupValues.startsWith("!!(")) {
        // Remove the "!!"
        groupValues = groupValues.substr(2);
      }
      if (groupValues.startsWith("(") !== groupValues.endsWith(")")) {
        // The filter must contain opening and closing parens or neither.
        return;
      }
      // Remove the surrounding parens.
      const cleanValues = groupValues.match(/[^(|^)]+/g);
      if (!cleanValues) {
        // If there are no values inside the parens...
        if (groupName.startsWith(WORKLOAD_FILTER_PREFIX)) {
          // This is only valid for workload annotations, in which the value in
          // the parens is treated as a free text search for a particular
          // workload. An empty string matches any node with that workload.
          filters[groupName] = [""];
        } else {
          return;
        }
      } else {
        // Split the comma separated values and add the filter.
        let valueList = cleanValues[0].split(",");
        if (allNegated) {
          valueList = valueList.map((value) => `!${value}`);
        }
        filters[groupName] = valueList;
      }
    } else if (!group.includes(":")) {
      // This is a free search value.
      filters.q.push(groupName);
    }
  });
  return filters;
};

// Convert "filters" into a search string.
export const filtersToString = (filters) => {
  let search = filters.q.length > 0 ? `${filters.q.join(" ")}` : "";
  Object.entries(filters).forEach(([type, terms]) => {
    // Skip empty and skip "q" as it gets appended at the
    // beginning of the search.
    if (terms.length === 0 || type === "q") {
      return;
    }
    search += ` ${type}:(${terms.join(",")})`;
  });
  return search.trim();
};

// Return the index of the value in the type for the filter.
const _getFilterValueIndex = (filters, type, value) => {
  const values = filters[type];
  if (!values) {
    return -1;
  }
  const lowerValues = values.map((value) => value.toLowerCase());
  return lowerValues.indexOf(value.toLowerCase());
};

// Whether the type and value are in the filters.
export const isFilterActive = (filters, type, value, exact = false) => {
  if (!filters) {
    return false;
  }
  if (type === "workload_annotations") {
    // A workload annotation filter is considered active if it simply exists.
    return Object.keys(filters).some(
      (filter) => filter === `${WORKLOAD_FILTER_PREFIX}${value}`
    );
  }
  const values = filters[type];
  if (!values) {
    return false;
  }
  if (exact) {
    value = `=${value}`;
  }
  return _getFilterValueIndex(filters, type, value) !== -1;
};

/**
 * Toggles a filter on or off based on type and value.
 * @param {Object} filters - The initial filters.
 * @param {String} type - The filter key.
 * @param {Any} value - The filter value to toggle.
 * @param {Boolean} exact - Optional value for whether the value should
 * exactly match.
 * @param {Boolean} shouldExist - An optional value for whether the value should
 * exist or not i.e. if true and the value exists there will be no change and
 * vice versa.
 * @returns {Boolean} Tag loading state.
 */
export const toggleFilter = (filters, type, value, exact, shouldExist) => {
  if (exact) {
    value = "=" + value;
  }
  const idx = _getFilterValueIndex(filters, type, value);
  const exists = idx !== -1;
  if (!exists) {
    if (shouldExist === undefined ? true : shouldExist) {
      if (typeof filters[type] === "undefined") {
        filters[type] = [];
      }
      filters[type].push(value);
    }
  } else if (exists) {
    if (shouldExist === undefined ? true : !shouldExist) {
      filters[type].splice(idx, 1);
      if (filters[type].length === 0) {
        delete filters[type];
      }
    }
  }
  return filters;
};

// Store a filter for later.
export const storeFilters = (name, filters) => {
  storedFilters[name] = filters;
};

// Retrieve a stored filter.
export const retrieveFilters = (name) => storedFilters[name];

// Convert a URL query string into a filter object.
export const queryStringToFilters = (queryString) => {
  let filters = getEmptyFilter();
  [...new URLSearchParams(queryString)].forEach(([name, values]) => {
    if (!values.length) {
      // There are no values for this filter so ignore it.
      return;
    }
    filters[name] = values.split(",");
  });
  return filters;
};

// Convert a filter object into a URL query string.
export const filtersToQueryString = (filters) => {
  // Shallow copy the object, this should be good enough for the manipulation
  // we do below.
  let copiedFilters = { ...filters };
  // Remove empty filters.
  Object.keys(copiedFilters).forEach((filter) => {
    // Remove in:selected in in:!selected from the URL as we don't also persist
    // the selected states of machines.
    if (copiedFilters[filter].length === 0 || filter === "in") {
      delete copiedFilters[filter];
    }
  });
  return `?${new URLSearchParams(copiedFilters).toString()}`;
};
