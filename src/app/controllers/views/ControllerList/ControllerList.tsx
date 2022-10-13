import { useCallback, useEffect, useState } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom-v5-compat";

import ControllerListControls from "./ControllerListControls";
import ControllerListHeader from "./ControllerListHeader";
import ControllerListTable from "./ControllerListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { ControllerHeaderContent } from "app/controllers/types";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller } from "app/store/controller/types";
import { FilterControllers } from "app/store/controller/utils";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { NodeType } from "app/store/types/node";

const getVaultConfiguredControllers = (controllers: Controller[]) => {
  const regionControllers = controllers.filter((controller) => {
    return (
      controller.node_type === NodeType.REGION_CONTROLLER ||
      controller.node_type === NodeType.REGION_AND_RACK_CONTROLLER
    );
  });
  const unconfiguredControllers = regionControllers.filter((controller) => {
    return controller.vault_configured === false;
  }).length;
  const configuredControllers = regionControllers.filter((controller) => {
    return controller.vault_configured === true;
  }).length;

  return [unconfiguredControllers, configuredControllers];
};

const ControllerList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const selectedIDs = useSelector(controllerSelectors.selectedIDs);
  const regionControllers = useSelector((state: RootState) =>
    controllerSelectors.search(
      state,
      `node_type:(=${NodeType.REGION_CONTROLLER},${NodeType.REGION_AND_RACK_CONTROLLER})`,
      selectedIDs
    )
  );
  const [unconfiguredControllers, configuredControllers] =
    getVaultConfiguredControllers(regionControllers);
  const filteredControllers = useSelector((state: RootState) =>
    controllerSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const controllersLoading = useSelector(controllerSelectors.loading);
  useWindowTitle("Controllers");

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(tagActions.fetch());
  }, [dispatch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterControllers.getCurrentFilters(searchText);
      navigate({ search: FilterControllers.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
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
      {configuredControllers >= 1 && unconfiguredControllers >= 1 ? (
        <Notification severity="caution" title="Incomplete Vault integration">
          Configure {unconfiguredControllers} other{" "}
          <a href="/controllers">
            {unconfiguredControllers > 1 ? "controllers" : "controller"}
          </a>{" "}
          with Vault to complete this operation. Check the{" "}
          <a href="/settings/configuration/security">security settings</a> for
          more information.
        </Notification>
      ) : null}
      <ControllerListControls
        filter={searchFilter}
        setFilter={setSearchFilter}
      />
      <ControllerListTable
        controllers={filteredControllers}
        hasFilter={!!searchFilter}
        loading={controllersLoading}
        onSelectedChange={(controllerIDs) => {
          dispatch(controllerActions.setSelected(controllerIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </Section>
  );
};

export default ControllerList;
