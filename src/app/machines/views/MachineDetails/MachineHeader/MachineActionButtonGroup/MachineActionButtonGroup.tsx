import { Button, Icon } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import PowerIcon from "app/base/components/PowerIcon";
import { actions as machineActions } from "app/store/machine";
import { PowerState } from "app/store/types/enum";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  onActionClick: (action: NodeActions) => void;
  systemId: string;
};

type ActionGroup = {
  actions: NodeActions[];
  title: string;
  isIcons?: boolean;
};

const actionGroups: ActionGroup[] = [
  {
    title: "Actions",
    actions: [
      NodeActions.COMMISSION,
      NodeActions.ACQUIRE,
      NodeActions.DEPLOY,
      NodeActions.RELEASE,
      NodeActions.ABORT,
      NodeActions.CLONE,
    ],
  },
  {
    title: "Power cycle",
    actions: [NodeActions.ON],
  },
  {
    title: "Troubleshoot",
    actions: [
      NodeActions.TEST,
      NodeActions.RESCUE_MODE,
      NodeActions.MARK_BROKEN,
    ],
  },
  {
    title: "Categorize",
    actions: [NodeActions.TAG, NodeActions.SET_ZONE, NodeActions.SET_POOL],
  },
  {
    title: "Lock/Unlock",
    actions: [NodeActions.LOCK, NodeActions.UNLOCK],
    isIcons: true,
  },
  {
    title: "Delete",
    actions: [NodeActions.DELETE],
    isIcons: true,
  },
];

export const MachineActionButtonGroup = ({
  onActionClick,
  systemId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="p-button-group">
      {actionGroups.map((group) => (
        <div>
          <div className="u-sv1 p-muted-heading">{group.title}</div>
          <div className="p-button-group__subgroup">
            {group.actions.map((action) =>
              group.title !== "Power cycle" ? (
                <Button onClick={() => onActionClick(action)}>
                  {group.isIcons ? (
                    <Icon aria-label={action} name={action} />
                  ) : (
                    `${getNodeActionTitle(action)}`
                  )}
                </Button>
              ) : (
                <>
                  <Button onClick={() => onActionClick(NodeActions.ON)}>
                    <PowerIcon powerState={PowerState.ON}>On</PowerIcon>
                  </Button>
                  <Button onClick={() => onActionClick(NodeActions.OFF)}>
                    <PowerIcon powerState={PowerState.ERROR}>Off</PowerIcon>
                  </Button>
                  <Button
                    onClick={() => {
                      dispatch(machineActions.checkPower(systemId));
                    }}
                  >
                    Check
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MachineActionButtonGroup;
