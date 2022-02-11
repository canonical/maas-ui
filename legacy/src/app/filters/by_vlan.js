/* Copyright 2015-2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * MAAS Filter Subnets by VLAN.
 */
import angular from "angular";

export function filterByVLAN() {
  return function (subnets, vlan) {
    var filtered = [];
    var id;
    if (angular.isObject(vlan)) {
      id = vlan.id;
    } else if (angular.isNumber(vlan)) {
      id = vlan;
    } else {
      return filtered;
    }
    angular.forEach(subnets, function (subnet) {
      if (subnet.vlan === id) {
        filtered.push(subnet);
      }
    });
    return filtered;
  };
}

