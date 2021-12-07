import { useDispatch, useSelector } from "react-redux";

import NodeActionFormWrapper from "app/base/components/node/NodeActionFormWrapper";
import type { ClearHeaderContent } from "app/base/types";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { Device, DeviceActions } from "app/store/device/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  action: DeviceActions;
  clearHeaderContent: ClearHeaderContent;
  devices: Device[];
  viewingDetails: boolean;
};

export const ActionFormWrapper = ({
  action,
  clearHeaderContent,
  devices,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const deleting = useSelector(deviceSelectors.deleting);
  const settingZone = useSelector(deviceSelectors.settingZone);
  const processingCount =
    action === NodeActions.DELETE ? deleting.length : settingZone.length;

  return (
    <NodeActionFormWrapper
      action={action}
      clearHeaderContent={clearHeaderContent}
      nodes={devices}
      nodeType="device"
      processingCount={processingCount}
      onUpdateSelected={(deviceIDs) =>
        dispatch(deviceActions.setSelected(deviceIDs))
      }
      viewingDetails={viewingDetails}
    >
      {action}
    </NodeActionFormWrapper>
  );
};

export default ActionFormWrapper;
