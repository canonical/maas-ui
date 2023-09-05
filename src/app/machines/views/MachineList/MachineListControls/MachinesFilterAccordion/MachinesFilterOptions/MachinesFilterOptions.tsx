import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button, List, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  FilterGroup,
  FilterGroupOptionType,
} from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export enum Label {
  False = "false",
  Loading = "Loading...",
  None = "No options",
  True = "true",
}

type Props = {
  group: FilterGroup["key"];
  searchText?: string;
  setSearchText: (searchText: string) => void;
};

const MachinesFilterOptions = ({
  group,
  searchText,
  setSearchText,
}: Props): JSX.Element => {
  const dispatch = useDispatch();

  let filterOptions = useSelector((state: RootState) =>
    machineSelectors.filterOptions(state, group)
  );
  const optionsLoading = useSelector((state: RootState) =>
    machineSelectors.filterOptionsLoading(state, group)
  );
  const optionsLoaded = useSelector((state: RootState) =>
    machineSelectors.filterOptionsLoaded(state, group)
  );
  const currentFilters = FilterMachines.getCurrentFilters(searchText);

  if (group === "workloads") {
    // Workload annotations are key/value pairs, but we're given
    // them as a string "key:value". So we need to split them.
    const filterKeys = filterOptions.map((filter) => {
      return filter.key.toString().split(":")[0];
    });

    // Find the count of each workload annotation key
    const counts = filterKeys.reduce(
      (result: { key: string; count: number }[], currentFilterKey) => {
        const existingFilter = result.find(
          (filter) => filter.key === currentFilterKey
        );

        if (existingFilter) {
          existingFilter.count++;
        } else {
          result.push({ key: currentFilterKey, count: 1 });
        }

        return result;
      },
      []
    );

    // Turn array of keys and counts into valid filter options
    filterOptions = counts.map((filterCount) => ({
      key: filterCount.key,
      label: `${filterCount.key} (${filterCount.count})`,
    }));
  }

  useEffect(() => {
    if (!optionsLoading && !optionsLoaded) {
      dispatch(machineActions.filterOptions(group));
    } else {
    }
  }, [dispatch, group, optionsLoading, optionsLoaded]);

  let items: ReactNode[];
  if (optionsLoading) {
    items = [
      <span className="filter-accordion__item u-align-text--center">
        <Spinner text={Label.Loading} />
      </span>,
    ];
  } else if (!filterOptions || filterOptions.length === 0) {
    items = [
      <span className="filter-accordion__item u-text--muted">
        {Label.None}
      </span>,
    ];
  } else {
    items = filterOptions.map((filter) => {
      let key: Exclude<FilterGroupOptionType, boolean>;
      if (typeof filter.key === "boolean") {
        key = filter.key ? Label.True : Label.False;
      } else {
        key = filter.key;
      }
      const isActive = FilterMachines.isFilterActive(
        currentFilters,
        group,
        key,
        true
      );
      return (
        <Button
          appearance="base"
          aria-checked={isActive}
          className={classNames(
            "u-align-text--left u-no-margin--bottom filter-accordion__item is-dense",
            {
              "is-active": isActive,
            }
          )}
          onClick={() => {
            const newFilters = FilterMachines.toggleFilter(
              currentFilters,
              group,
              key,
              true
            );
            setSearchText(FilterMachines.filtersToString(newFilters));
          }}
          role="checkbox"
        >
          {filter.label}
        </Button>
      );
    });
  }

  return <List className="u-no-margin--bottom" items={items} />;
};

export default MachinesFilterOptions;
