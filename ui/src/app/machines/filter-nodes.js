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

const filterNodes = (nodes, search, selectedIDs) => {
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
  Object.entries(filters).forEach(([attr, terms]) => {
    if (terms.length === 0) {
      // If this attribute has no associated terms then skip it.
      return;
    }
    if (attr === "in") {
      // "in:" is used to filter the nodes by those that are
      // currently selected.
      terms.forEach(term => {
        if (term.toLowerCase() === "selected") {
          nodes = nodes.filter(({ system_id }) =>
            selectedIDs.includes(system_id)
          );
        } else if (term.toLowerCase() === "!selected") {
          nodes = nodes.filter(
            ({ system_id }) => !selectedIDs.includes(system_id)
          );
        }
      });
    } else {
      // Loop through each item and only select the matching.
      const matched = [];
      nodes.forEach(node => {
        // Loop through the attributes to check. If this is for the
        // generic "_" filter then check against all node attributes.
        (attr === "_" ? Object.keys(node) : [attr]).some(key => {
          let value = getMachineValue(node, key);
          // Unable to get value for this node. So skip it.
          if (typeof value === "undefined") {
            return false;
          }

          return terms.some(term => {
            term = term.toLowerCase();
            let exact = false;
            let negate = false;

            // '!' at the beginning means the term is negated.
            while (term.indexOf("!") === 0) {
              negate = !negate;
              term = term.substring(1);
            }

            // '=' at the beginning means to match exactly.
            if (term.indexOf("=") === 0) {
              exact = true;
              term = term.substring(1);
            }

            // Allow '!' after the '=' as well.
            while (term.indexOf("!") === 0) {
              negate = !negate;
              term = term.substring(1);
            }

            if (Array.isArray(value)) {
              // If value is an array check if the
              // term matches any value in the
              // array. If negated, check whether no
              // value in the array matches.
              const match = value.some(v => {
                if (matches(v, term, exact, false)) {
                  return true;
                }
                return false;
              });
              if (negate) {
                // Push to matched only if no value in the array matches term.
                if (!match) {
                  matched.push(node);
                  return true;
                }
              } else if (match) {
                matched.push(node);
                return true;
              }
            } else {
              // Standard value check that it matches the term.
              if (matches(value, term, exact, negate)) {
                matched.push(node);
                return true;
              }
            }
            return false;
          });
        });
      });
      nodes = matched;
    }
  });
  return nodes;
};

export default filterNodes;
