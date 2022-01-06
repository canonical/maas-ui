import { ControllerMeta } from "app/store/controller/types";
import type { Controller } from "app/store/controller/types";
import type { FilterValue } from "app/utils/search/filter-handlers";
import {
  isFilterValue,
  isFilterValueArray,
} from "app/utils/search/filter-handlers";
import FilterItems from "app/utils/search/filter-items";

type SearchMappings = {
  [x: string]: (controller: Controller) => FilterValue | FilterValue[] | null;
};

// Helpers that convert the pseudo field on the controller to an actual value.
const searchMappings: SearchMappings = {
  domain: (controller: Controller) => controller.domain.name,
};

export const getControllerValue = (
  controller: Controller,
  filter: string
): FilterValue | FilterValue[] | null => {
  const mapFunc = filter in searchMappings ? searchMappings[filter] : null;
  let value: FilterValue | FilterValue[] | null = null;
  if (mapFunc) {
    value = mapFunc(controller);
  } else if (controller.hasOwnProperty(filter)) {
    const controllerValue = controller[filter as keyof Controller];
    // Only return values that are valid for filters, all other values should
    // use the map function above.
    if (isFilterValue(controllerValue) || isFilterValueArray(controllerValue)) {
      value = controllerValue;
    }
  }
  return value;
};

export const FilterControllers = new FilterItems<Controller, ControllerMeta.PK>(
  ControllerMeta.PK,
  getControllerValue
);
