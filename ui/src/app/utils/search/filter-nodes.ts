import FilterHandlers from "./filter-handlers";
import type { Filters, FilterValue, PrefixedFilter } from "./filter-handlers";

export type GetValue<N> = (
  node: N,
  filter: string
) => FilterValue | FilterValue[] | null;

export default class FilterNodes<N, PK extends keyof N> extends FilterHandlers {
  getValue: GetValue<N>;
  primaryKey: PK;

  constructor(
    primaryKey: PK,
    getValue: GetValue<N>,
    prefixedFilters?: PrefixedFilter[]
  ) {
    super(prefixedFilters);
    this.primaryKey = primaryKey;
    this.getValue = getValue;
  }

  // Return true when lowercase value contains the already
  // lowercased lowerTerm.
  _matches = (
    value: FilterValue,
    lowerTerm: string,
    exact: boolean
  ): boolean => {
    if (typeof value === "number") {
      // Check that term is a valid number before comparing it to the value.
      // This is to prevent issues when parsing strings to numbers
      // e.g. parseInt("1thing") returns the number 1.
      if (isNaN(Number(lowerTerm))) {
        return false;
      }
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
      return false;
    }
  };

  // Return true if value matches lowerTerm, unless negate is true then
  // return false if matches.
  matches = (
    value: FilterValue,
    lowerTerm: string,
    exact: boolean,
    negate: boolean
  ): boolean => {
    const match = this._matches(value, lowerTerm, exact);
    return negate ? !match : match;
  };

  filterByTerms = (
    filteredNodes: N[],
    attr: keyof Filters,
    terms: FilterValue[],
    selectedIDs: N[PK][]
  ): N[] =>
    filteredNodes.filter((node) => {
      let matched = false;
      let exclude = false;
      // Loop through the attributes to check. If this is for the
      // generic "q" filter then check against all node attributes.
      (attr === "q" ? Object.keys(node) : [attr]).some((filterAttribute) => {
        if (filterAttribute === "in") {
          // "in:" is used to filter the nodes by those that are
          // currently selected.
          const selected = selectedIDs.includes(node[this.primaryKey]);
          // The terms will be an array, but it is invalid to have more than
          // one of 'selected' or '!selected'.
          const term = terms[0].toString().toLowerCase();
          const onlySelected = term === "selected";
          const onlyNotSelected = term === "!selected";
          if ((selected && onlySelected) || (!selected && onlyNotSelected)) {
            matched = true;
          } else {
            exclude = true;
          }
          return false;
        }
        const nodeAttribute = this.getValue(node, filterAttribute.toString());
        if (!nodeAttribute && nodeAttribute !== 0) {
          // Unable to get value for this node. So skip it.
          return false;
        }
        return terms.some((term) => {
          let cleanTerm = term.toString().toLowerCase();
          // Get the first two characters, to check for ! or =.
          const special = cleanTerm.substring(0, 2);
          const exact = special.includes("=");
          const negate = special.includes("!") && special !== "!!";
          // Remove the special characters to get the term.
          cleanTerm = cleanTerm.replace(/^[!|=]+/, "");
          return (
            Array.isArray(nodeAttribute) ? nodeAttribute : [nodeAttribute]
          ).some((attribute) => {
            const match = this.matches(attribute, cleanTerm, exact, false);
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

  filterNodes = (nodes: N[], search: string, selectedIDs: N[PK][]): N[] => {
    let filteredNodes = nodes;
    if (
      typeof nodes === "undefined" ||
      typeof search === "undefined" ||
      nodes.length === 0
    ) {
      return nodes;
    }
    const filters = this.getCurrentFilters(search);
    if (!filters) {
      // No matching filters were found.
      return [];
    }
    // Progressively filter the list of nodes for each search term.
    Object.entries(filters).forEach(([attr, terms]) => {
      if (terms.length === 0) {
        // If this attribute has no associated terms then skip it.
        return;
      }
      if (attr === "q") {
        // When filtering free search we need all terms to match so subsequent
        // terms will reduce the list to those that match all.
        terms.forEach((term) => {
          filteredNodes = this.filterByTerms(
            filteredNodes,
            attr,
            [term],
            selectedIDs
          );
        });
      } else {
        filteredNodes = this.filterByTerms(
          filteredNodes,
          attr,
          terms,
          selectedIDs
        );
      }
    });
    return filteredNodes;
  };
}
