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
  const terms = search.split(" ");
  let processingFilter;
  terms.forEach(term => {
    if (processingFilter) {
      const filter = filters[processingFilter];
      // A previous term had a space in it. This may contain multiple comma
      // separated terms, the first of which will be part of the last term to
      // be added to the filter.
      term.split(",").forEach((termItem, i) => {
        termItem = termItem.replace(")", "");
        if (i === 0) {
          // If this is the first term it is part of the last term to be added.
          filter[filter.length - 1] += ` ${termItem}`;
        } else {
          // This is a new term.
          filter.push(termItem);
        }
      });
      // If the term contains the ending ')' then it's the last in the group.
      if (term.includes(")")) {
        processingFilter = null;
      }
    } else if (term.includes(":")) {
      // This is a filter for a specific property.
      let [filter, values: ""] = term.split(":");
      // Remove the starting '(' and ending ')'.
      values = values.replace("(", "").replace(")", "");
      if (!values) {
        // This filter has no values so skip it.
        return;
      }
      // Add the values to the filter.
      filters[filter] = values.split(",");
      if (term.includes("(") && !term.includes(")")) {
        // Contains a starting '(' but not an ending ')' so the next term in the
        // array is part of the current filter.
        processingFilter = filter;
      }
    } else {
      // Term is not part of a previous '(..)' span so add it to the generic
      // filters.
      filters._.push(term);
    }
  });
  // If the filter has finished looping over the terms without
  // closing the current filter then it is malformed.
  if (processingFilter) {
    return null;
  }
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
