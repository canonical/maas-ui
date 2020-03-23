import { getCurrentFilters } from "./search";
import { getMachineValue } from "app/utils";

// Return true when lowercase value contains the already
// lowercased lowerTerm.
const _matches = (value, lowerTerm, exact) => {
  if (typeof value === "number") {
    if (exact) {
      if (Number.isInteger(value)) {
        return value === parseInt(lowerTerm, 10);
      } else {
        return value === parseFloat(lowerTerm);
      }
    } else {
      if (Number.isInteger(value)) {
        return value >= parseInt(lowerTerm, 10);
      } else {
        return value >= parseFloat(lowerTerm);
      }
    }
  } else if (typeof value === "string") {
    if (exact) {
      return value.toLowerCase() === lowerTerm;
    } else {
      return value.toLowerCase().indexOf(lowerTerm) >= 0;
    }
  } else {
    return value === lowerTerm;
  }
};

// Return true if value matches lowerTerm, unless negate is true then
// return false if matches.
const matches = (value, lowerTerm, exact, negate) => {
  const match = _matches(value, lowerTerm, exact);
  return negate ? !match : match;
};

const filterByTerms = (filteredNodes, attr, terms, selectedIDs) =>
  filteredNodes.filter(node => {
    let matched = false;
    let exclude = false;
    // Loop through the attributes to check. If this is for the
    // generic "_" filter then check against all node attributes.
    (attr === "_" ? Object.keys(node) : [attr]).some(filterAttribute => {
      if (filterAttribute === "in") {
        // "in:" is used to filter the nodes by those that are
        // currently selected.
        const selected = selectedIDs.includes(node.system_id);
        // The terms will be an array, but it is invalid to have more than
        // one of 'selected' or '!selected'.
        const term = terms[0].toLowerCase();
        const onlySelected = term === "selected";
        const onlyNotSelected = term === "!selected";
        if ((selected && onlySelected) || (!selected && onlyNotSelected)) {
          matched = true;
        } else {
          exclude = true;
        }
        return false;
      }
      let machineAttribute = getMachineValue(node, filterAttribute);
      if (typeof machineAttribute === "undefined") {
        // Unable to get value for this node. So skip it.
        return false;
      }
      return terms.some(term => {
        let cleanTerm = term.toLowerCase();
        // Get the first two characters, to check for ! or =.
        const special = cleanTerm.substring(0, 2);
        const exact = special.includes("=");
        const negate = special.includes("!") && special !== "!!";
        // Remove the special characters to get the term.
        cleanTerm = cleanTerm.replace(/^[!|=]+/, "");
        return (Array.isArray(machineAttribute)
          ? machineAttribute
          : [machineAttribute]
        ).some(attribute => {
          const match = matches(attribute, cleanTerm, exact, false);
          if (match) {
            if (negate) {
              exclude = true;
            } else {
              matched = true;
            }
          } else if (negate) {
            matched = true;
          }
          // If an exclude was found then exit the loop.
          return exclude;
        });
      });
    });
    return matched && !exclude;
  });

const filterNodes = (nodes, search, selectedIDs) => {
  let filteredNodes = nodes;
  if (
    typeof nodes === "undefined" ||
    typeof search === "undefined" ||
    nodes.length === 0
  ) {
    return nodes;
  }
  const filters = getCurrentFilters(search);
  if (!filters) {
    // No matching filters were found.
    return [];
  }
  // Progressively filter the list of machines for each search term.
  Object.entries(filters).forEach(([attr, terms]) => {
    if (terms.length === 0) {
      // If this attribute has no associated terms then skip it.
      return;
    }
    if (attr === "_") {
      // When filtering free search we need all terms to match so subsequent
      // terms will reduce the list to those that match all.
      terms.forEach(term => {
        filteredNodes = filterByTerms(filteredNodes, attr, [term], selectedIDs);
      });
    } else {
      filteredNodes = filterByTerms(filteredNodes, attr, terms, selectedIDs);
    }
  });
  return filteredNodes;
};

export default filterNodes;
