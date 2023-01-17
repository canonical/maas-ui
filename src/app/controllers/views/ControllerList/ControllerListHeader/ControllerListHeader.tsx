import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import { useSendAnalytics } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import ControllerHeaderForms from "app/controllers/components/ControllerHeaderForms";
import { ControllerHeaderViews } from "app/controllers/constants";
import type {
  ControllerHeaderContent,
  ControllerSetHeaderContent,
} from "app/controllers/types";
import { getHeaderTitle } from "app/controllers/utils";
import controllerSelectors from "app/store/controller/selectors";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  headerContent: ControllerHeaderContent | null;
  setHeaderContent: ControllerSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const ControllerListHeader = ({
  headerContent,
  setHeaderContent,
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
            setHeaderContent({ view: ControllerHeaderViews.ADD_CONTROLLER })
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
            const view = Object.values(ControllerHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
          showCount
        />,
      ]}
      headerContent={
        headerContent && (
          <ControllerHeaderForms
            controllers={selectedControllers}
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        )
      }
      sidePanelTitle={getHeaderTitle("Controllers", headerContent)}
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
