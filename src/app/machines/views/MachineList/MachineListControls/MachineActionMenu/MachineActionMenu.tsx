import { useCallback } from "react";

import { useStorageState } from "react-storage-hooks";

import NodeActionMenu from "app/base/components/NodeActionMenu";
import NodeActionMenuGroup from "app/base/components/NodeActionMenuGroup";
import { useSendAnalytics } from "app/base/hooks";
import { MachineSidePanelViews } from "app/machines/constants";
import type { MachineSetSidePanelContent } from "app/machines/types";
import type { useHasSelection } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

const MachineActionMenu = ({
  hasSelection,
  setSidePanelContent,
}: {
  hasSelection: ReturnType<typeof useHasSelection>;
  setSidePanelContent: MachineSetSidePanelContent;
}) => {
  const sendAnalytics = useSendAnalytics();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  const getTitle = useCallback(
    (action: NodeActions) => {
      if (action === NodeActions.TAG) {
        const title = getNodeActionTitle(action);
        if (!tagsSeen) {
          return (
            <>
              {title} <i className="p-text--small">(NEW)</i>
            </>
          );
        }
        return title;
      }
      return null;
    },
    [tagsSeen]
  );

  return (
    <>
      <div className="u-hide--medium u-hide--small">
        <NodeActionMenuGroup
          alwaysShowLifecycle
          excludeActions={[NodeActions.IMPORT_IMAGES]}
          getTitle={getTitle}
          hasSelection={hasSelection}
          nodeDisplay="machine"
          onActionClick={(action) => {
            if (action === NodeActions.TAG && !tagsSeen) {
              setTagsSeen(true);
            }
            const view = Object.values(MachineSidePanelViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
            sendAnalytics(
              "Machine list action form",
              getNodeActionTitle(action),
              "Open"
            );
          }}
        />
      </div>
      <div className="u-hide--large">
        <NodeActionMenu
          alwaysShowLifecycle
          className="is-maas-select"
          constrainPanelWidth
          excludeActions={[NodeActions.IMPORT_IMAGES]}
          getTitle={getTitle}
          hasSelection={hasSelection}
          menuPosition="left"
          nodeDisplay="machine"
          onActionClick={(action) => {
            if (action === NodeActions.TAG && !tagsSeen) {
              setTagsSeen(true);
            }
            const view = Object.values(MachineSidePanelViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
            sendAnalytics(
              "Machine list action form",
              getNodeActionTitle(action),
              "Open"
            );
          }}
          toggleAppearance=""
          toggleClassName="p-action-menu"
          toggleLabel="Menu"
        />
      </div>
    </>
  );
};

export default MachineActionMenu;
