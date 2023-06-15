import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom-v5-compat";

import ControllerListControls from "./ControllerListControls";
import ControllerListHeader from "./ControllerListHeader";
import ControllerListTable from "./ControllerListTable";

import PageContent from "app/base/components/PageContent/PageContent";
import VaultNotification from "app/base/components/VaultNotification";
import { useWindowTitle } from "app/base/hooks";
import { useSidePanel } from "app/base/side-panel-context";
import ControllerForms from "app/controllers/components/ControllerForms/ControllerForms";
import { getHeaderTitle } from "app/controllers/utils";
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
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const selectedControllers = useSelector(controllerSelectors.selected);
  const [searchFilter, setFilter] = useState(
    // Initialise the filter state from the URL.
    FilterControllers.filtersToString(currentFilters)
  );
  const selectedIDs = useSelector(controllerSelectors.selectedIDs);

  const filteredControllers = useSelector((state: RootState) =>
    controllerSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const controllersLoading = useSelector(controllerSelectors.loading);
  const vaultEnabledLoading = useSelector(vaultEnabledSelectors.loading);
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
    <PageContent
      header={
        <ControllerListHeader
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
        />
      }
      sidePanelContent={
        sidePanelContent && (
          <ControllerForms
            controllers={selectedControllers}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getHeaderTitle("Controllers", sidePanelContent)}
    >
      <VaultNotification />
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
    </PageContent>
  );
};

export default ControllerList;
