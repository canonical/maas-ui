import { getCurrentFilters } from "./search";

// Helpers that convert the pseudo field on node to an actual
// value from the node.
const mappings = {
  cpu: node => node.cpu_count,
  cores: node => node.cpu_count,
  ram: node => node.memory,
  mac: node => [node.pxe_mac, ...node.extra_macs],
  zone: node => node.zone.name,
  pool: node => node.pool.name,
  pod: node => node.pod && node.pod.name,
  "pod-id": node => node.pod && node.pod.id,
  power: node => node.power_state,
  release: node =>
    node.status_code === 6 || node.status_code === 9
      ? node.osystem + "/" + node.distro_series
      : "",
  hostname: node => node.hostname,
  vlan: node => node.vlan,
  rack: node => node.observer_hostname,
  subnet: node => node.subnet_cidr,
  numa_nodes_count: ({ numa_nodes_count, numa_nodes }) => {
    const count = numa_nodes_count || (numa_nodes && numa_nodes.length);
    return `${count} node${count !== 1 ? "s" : ""}`;
  },
  sriov_support: ({ sriov_support, interfaces }) =>
    sriov_support ||
    (interfaces && interfaces.some(iface => iface.sriov_max_vf >= 1))
      ? "Supported"
      : "Not supported"
};

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

const filterNodes = (nodes, search) => {
  if (
    typeof nodes === "undefined" ||
    typeof search === "undefined" ||
    nodes.length === 0
  ) {
    return nodes;
  }
  const filters = getCurrentFilters(search);
  Object.entries(filters).forEach(([attr, terms]) => {
    if (terms.length === 0) {
      // If this attribute has no associated terms then skip it.
      return;
    }
    if (attr === "in") {
      // "in:" is used to filter the nodes by those that are
      // currently selected.
      terms.forEach(term => {
        const matched = [];
        nodes.forEach(node => {
          if (node.$selected && term.toLowerCase() === "selected") {
            matched.push(node);
          } else if (!node.$selected && term.toLowerCase() === "!selected") {
            matched.push(node);
          }
        });
        nodes = matched;
      });
    } else {
      // Loop through each item and only select the matching.
      const matched = [];
      nodes.forEach(node => {
        // Loop through the attributes to check. If this is for the
        // generic "_" filter then check against all node attributes.
        (attr === "_" ? Object.keys(node) : [attr]).some(key => {
          // Mapping function for the attribute.
          const mapFunc = mappings[key];
          let value;
          if (typeof mapFunc === "function") {
            value = mapFunc(node);
          } else if (node.hasOwnProperty(key)) {
            value = node[key];
          }

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
