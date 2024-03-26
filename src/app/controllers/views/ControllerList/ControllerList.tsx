import { useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import ControllerListHeader from "./ControllerListHeader";
import ControllerListTable from "./ControllerListTable";

import PageContent from "@/app/base/components/PageContent/PageContent";
import VaultNotification from "@/app/base/components/VaultNotification";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import ControllerForms from "@/app/controllers/components/ControllerForms/ControllerForms";
import { controllerActions } from "@/app/store/controller";
import controllerSelectors from "@/app/store/controller/selectors";
import { FilterControllers } from "@/app/store/controller/utils";
import { generalActions } from "@/app/store/general";
import { vaultEnabled as vaultEnabledSelectors } from "@/app/store/general/selectors";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

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

  useFetchActions([
    controllerActions.fetch,
    tagActions.fetch,
    generalActions.fetchVaultEnabled,
  ]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText: string) => {
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
          searchFilter={searchFilter}
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
      sidePanelTitle={getSidePanelTitle("Controllers", sidePanelContent)}
    >
      <VaultNotification />
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
