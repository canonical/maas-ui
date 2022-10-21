import { useCallback, useEffect, useState } from "react";

import { Link, Notification } from "@canonical/react-components";
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
import { FilterControllers } from "app/store/controller/utils";
import { actions as generalActions } from "app/store/general";
import { vaultEnabled as vaultEnabledSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";

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

  const { unconfiguredControllers, configuredControllers } = useSelector(
    (state: RootState) =>
      controllerSelectors.getVaultConfiguredControllers(state)
  );
  const filteredControllers = useSelector((state: RootState) =>
    controllerSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const controllersLoading = useSelector(controllerSelectors.loading);
  const vaultEnabledLoading = useSelector(vaultEnabledSelectors.loading);
  const vaultEnabled = useSelector(vaultEnabledSelectors.get);
  useWindowTitle("Controllers");

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(generalActions.fetchVaultEnabled());
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
      {configuredControllers.length >= 0 &&
      unconfiguredControllers.length >= 1 ? (
        <Notification severity="caution" title="Incomplete Vault integration">
          Configure {unconfiguredControllers.length} other{" "}
          <Link href="/controllers">
            {unconfiguredControllers.length > 1 ? "controllers" : "controller"}
          </Link>{" "}
          with Vault to complete this operation. Check the{" "}
          <Link href="/settings/configuration/security">security settings</Link>{" "}
          for more information.
        </Notification>
      ) : unconfiguredControllers.length === 0 && vaultEnabled === false ? (
        <Notification severity="caution" title="Incomplete Vault integration">
          Migrate your secrets to Vault to complete this operation. Check the{" "}
          <Link href="/settings/configuration/security">security settings</Link>{" "}
          for more information.
        </Notification>
      ) : null}
      <ControllerListControls
        filter={searchFilter}
        setFilter={setSearchFilter}
      />
      <ControllerListTable
        controllers={filteredControllers}
        hasFilter={!!searchFilter}
        loading={controllersLoading || vaultEnabledLoading}
        onSelectedChange={(controllerIDs) => {
          dispatch(controllerActions.setSelected(controllerIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </Section>
  );
};

export default ControllerList;
