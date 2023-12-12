import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import NodeActionMenu from "@/app/base/components/NodeActionMenu";
import { useSendAnalytics } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import type { SetSearchFilter } from "@/app/base/types";
import { ControllerSidePanelViews } from "@/app/controllers/constants";
import controllerSelectors from "@/app/store/controller/selectors";
import { getNodeActionTitle } from "@/app/store/utils";

type Props = {
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: SetSidePanelContent;
};

const ControllerListHeader = ({
  setSidePanelContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const controllers = useSelector(controllerSelectors.all);
  const controllersLoaded = useSelector(controllerSelectors.loaded);
  const selectedControllers = useSelector(controllerSelectors.selected);
  const sendAnalytics = useSendAnalytics();

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
