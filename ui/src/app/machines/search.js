// Holds all stored filters.
const storedFilters = {};

// Return a new empty filter;
export const getEmptyFilter = () => ({ _: [] });

// Return all of the currently active filters for the given search.
export const getCurrentFilters = search => {
  const filters = getEmptyFilter();
  if (!search) {
    return filters;
  }
  // Match filters with parens e.g. 'status:(new,deployed)'.
  // Then: match filters without parens e.g. 'status:new,deployed' or 'status'
  const filterMatchingRegex = search.matchAll(
    /(\b\w+:!*\([^)]+\))|(!*\w+\S+)/g
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
        // There are no values inside the parens;
        return;
      }
      // Split the comma separated values and add the filter.
      let valueList = cleanValues[0].split(",");
      if (allNegated) {
        valueList = valueList.map(value => `!${value}`);
      }
      filters[groupName] = valueList;
    } else if (!group.includes(":")) {
      // This is a free search value.
      filters._.push(groupName);
    }
  });
  return filters;
};

// Convert "filters" into a search string.
export const filtersToString = filters => {
  let search = filters._.length > 0 ? `${filters._.join(" ")}` : "";
  Object.entries(filters).forEach(([type, terms]) => {
    // Skip empty and skip "_" as it gets appended at the
    // beginning of the search.
    if (terms.length === 0 || type === "_") {
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
  const lowerValues = values.map(value => value.toLowerCase());
  return lowerValues.indexOf(value.toLowerCase());
};

// Whether the type and value are in the filters.
export const isFilterActive = (filters, type, value, exact = false) => {
  if (!filters) {
    return false;
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

// Toggles a filter on or off based on type and value.
export const toggleFilter = (filters, type, value, exact) => {
  if (typeof filters[type] === "undefined") {
    filters[type] = [];
  }
  if (exact) {
    value = "=" + value;
  }
  const idx = _getFilterValueIndex(filters, type, value);
  if (idx === -1) {
    filters[type].push(value);
  } else {
    filters[type].splice(idx, 1);
  }
  return filters;
};

// Store a filter for later.
export const storeFilters = (name, filters) => {
  storedFilters[name] = filters;
};

// Retrieve a stored filter.
export const retrieveFilters = name => storedFilters[name];
