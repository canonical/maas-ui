import { useDispatch, useSelector } from "react-redux";

import DeleteForm from "@/app/base/components/node/DeleteForm";
import NodeActionFormWrapper from "@/app/base/components/node/NodeActionFormWrapper";
import SetZoneForm from "@/app/base/components/node/SetZoneForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import urls from "@/app/base/urls";
import { deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import type { Device, DeviceActions } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { kebabToCamelCase } from "@/app/utils";

type Props = {
  action: DeviceActions;
  devices: Device[];
  viewingDetails: boolean;
};

export const ActionFormWrapper = ({
  action,
  devices,
  viewingDetails,
}: Props): React.ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const dispatch = useDispatch();
  const deleting = useSelector(deviceSelectors.deleting);
  const settingZone = useSelector(deviceSelectors.settingZone);
  // The form expects one error, so we only show the latest error with the
  // assumption that all selected machines fail in the same way.
  const errors = useSelector((state: RootState) =>
    deviceSelectors.eventErrorsForDevices(
      state,
      devices.map(({ system_id }) => system_id),
      kebabToCamelCase(action)
    )
  )[0]?.error;
  const processingCount =
    action === NodeActions.DELETE ? deleting.length : settingZone.length;
  const commonNodeFormProps = {
    cleanup: deviceActions.cleanup,
    clearSidePanelContent: closeSidePanel,
    errors,
    modelName: "device",
    nodes: devices,
    processingCount,
    viewingDetails,
  };

  return (
    <NodeActionFormWrapper
      action={action}
      clearSidePanelContent={closeSidePanel}
      nodeType="device"
      nodes={devices}
      onUpdateSelected={(deviceIDs) =>
        dispatch(deviceActions.setSelected(deviceIDs))
      }
      processingCount={processingCount}
      viewingDetails={viewingDetails}
    >
      {action === NodeActions.DELETE ? (
        <DeleteForm
          onSubmit={() => {
            dispatch(deviceActions.cleanup());
            devices.forEach((device) => {
              dispatch(deviceActions.delete({ system_id: device.system_id }));
            });
          }}
          redirectURL={urls.devices.index}
          {...commonNodeFormProps}
        />
      ) : (
        <SetZoneForm
          onSubmit={(zoneID) => {
            dispatch(deviceActions.cleanup());
            devices.forEach((device) => {
              dispatch(
                deviceActions.setZone({
                  system_id: device.system_id,
                  zone_id: zoneID,
                })
              );
            });
          }}
          {...commonNodeFormProps}
        />
      )}
    </NodeActionFormWrapper>
  );
};

export default ActionFormWrapper;
