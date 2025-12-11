import type { Dispatch, SetStateAction } from "react";

import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import SetZoneForm from "../SetZoneForm";

import DeleteForm from "@/app/base/components/node/DeleteForm";
import NodeActionFormWrapper from "@/app/base/components/node/NodeActionFormWrapper";
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
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
};

export const ActionFormWrapper = ({
  action,
  devices,
  viewingDetails,
  setRowSelection,
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
      onUpdateSelected={(deviceIDs) => {
        setRowSelection &&
          setRowSelection(
            deviceIDs.reduce((acc, system_id): RowSelectionState => {
              const id = devices.find((d) => d.system_id === system_id)?.id;
              if (id === undefined) return acc;
              return { ...acc, [id.toString()]: true };
            }, {})
          );
      }}
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
        <SetZoneForm devices={devices} isViewingDetails={viewingDetails} />
      )}
    </NodeActionFormWrapper>
  );
};

export default ActionFormWrapper;
