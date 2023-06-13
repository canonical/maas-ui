import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import { useSendAnalytics } from "app/base/hooks";
import type { SidePanelContextType } from "app/base/side-panel-context";
import type { SetSearchFilter } from "app/base/types";
import ControllerForms from "app/controllers/components/ControllerForms";
import { ControllerSidePanelViews } from "app/controllers/constants";
import { getHeaderTitle } from "app/controllers/utils";
import controllerSelectors from "app/store/controller/selectors";
import { getNodeActionTitle } from "app/store/utils";

type Props = SidePanelContextType & {
  setSearchFilter: SetSearchFilter;
};

const ControllerListHeader = ({
  sidePanelContent,
  setSidePanelContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const controllers = useSelector(controllerSelectors.all);
  const controllersLoaded = useSelector(controllerSelectors.loaded);
  const selectedControllers = useSelector(controllerSelectors.selected);
  const sendAnalytics = useSendAnalytics();

  return (
    <SectionHeader
      buttons={[
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
        </Button>,
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
        />,
      ]}
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
      subtitle={
        <ModelListSubtitle
          available={controllers.length}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="controller"
          selected={selectedControllers.length}
        />
      }
      subtitleLoading={!controllersLoaded}
      title="Controllers"
    />
  );
};

export default ControllerListHeader;
