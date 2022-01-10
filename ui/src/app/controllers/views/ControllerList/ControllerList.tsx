import { useCallback, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";

import ControllerListControls from "./ControllerListControls";
import ControllerListHeader from "./ControllerListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { ControllerHeaderContent } from "app/controllers/types";
import { actions as controllerActions } from "app/store/controller";
import { FilterControllers } from "app/store/controller/utils";

const ControllerList = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const currentFilters = FilterControllers.queryStringToFilters(
    location.search
  );
  const [headerContent, setHeaderContent] =
    useState<ControllerHeaderContent | null>(null);
  const [searchFilter, setFilter] = useState(
    // Initialise the filter state from the URL.
    FilterControllers.filtersToString(currentFilters)
  );
  useWindowTitle("Controllers");

  useEffect(() => {
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterControllers.getCurrentFilters(searchText);
      history.push({ search: FilterControllers.filtersToQueryString(filters) });
    },
    [history, setFilter]
  );

  return (
    <Section
      header={
        <ControllerListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <ControllerListControls
        filter={searchFilter}
        setFilter={setSearchFilter}
      />
    </Section>
  );
};

export default ControllerList;
