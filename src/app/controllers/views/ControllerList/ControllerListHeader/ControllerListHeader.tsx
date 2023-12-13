import { useEffect, useState } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import { useSendAnalytics } from "app/base/hooks";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import type { SetSearchFilter } from "app/base/types";
import { ControllerSidePanelViews } from "app/controllers/constants";
import controllerSelectors from "app/store/controller/selectors";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: SetSidePanelContent;
};

const ControllerListHeader = ({
  searchFilter,
  setSidePanelContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const controllers = useSelector(controllerSelectors.all);
  const controllersLoaded = useSelector(controllerSelectors.loaded);
  const selectedControllers = useSelector(controllerSelectors.selected);
  const sendAnalytics = useSendAnalytics();
  const [searchText, setSearchText] = useState(searchFilter);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(searchFilter);
  }, [searchFilter]);

  return (
    <MainToolbar>
      <MainToolbar.Title>Controllers</MainToolbar.Title>
      {controllersLoaded ? (
        <ModelListSubtitle
          available={controllers.length}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="controller"
          selected={selectedControllers.length}
        />
      ) : (
        <Spinner text="Loading" />
      )}
      <MainToolbar.Controls>
        <DebounceSearchBox
          onDebounced={(debouncedText) => setSearchFilter(debouncedText)}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Button
          data-testid="add-controller-button"
          disabled={selectedControllers.length > 0}
          onClick={() =>
            setSidePanelContent({
              view: ControllerSidePanelViews.ADD_CONTROLLER,
            })
          }
        >
          Add rack controller
        </Button>
        <NodeActionMenu
          filterActions
          hasSelection={selectedControllers.length > 0}
          nodeDisplay="controller"
          nodes={selectedControllers}
          onActionClick={(action) => {
            sendAnalytics(
              "Controller list action form",
              getNodeActionTitle(action),
              "Open"
            );
            const view = Object.values(ControllerSidePanelViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
          }}
          showCount
        />
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default ControllerListHeader;
