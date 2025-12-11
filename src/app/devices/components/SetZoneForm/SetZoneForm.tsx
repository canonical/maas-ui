import { useDispatch, useSelector } from "react-redux";

import { SetZoneForm as BaseSetZoneForm } from "@/app/base/components/node/SetZoneForm/SetZoneForm";
import { deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import type { Device } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { kebabToCamelCase } from "@/app/utils";

type Props = {
  devices: Device[];
  isViewingDetails: boolean;
};

const SetZoneForm = ({ devices, isViewingDetails }: Props) => {
  const dispatch = useDispatch();
  const systemIds = devices.map((device) => device.system_id);
  const errors = useSelector((state: RootState) =>
    deviceSelectors.eventErrorsForDevices(
      state,
      systemIds,
      kebabToCamelCase(NodeActions.SET_ZONE)
    )
  )[0]?.error;
  const settingZone = useSelector(deviceSelectors.settingZone);
  const processingCount = settingZone.length;

  return (
    <BaseSetZoneForm
      cleanup={deviceActions.cleanup}
      errors={errors}
      isViewingDetails={isViewingDetails}
      modelName="device"
      nodes={devices}
      onSubmit={(zoneId) => {
        systemIds.forEach((systemId) => {
          dispatch(
            deviceActions.setZone({ system_id: systemId, zone_id: zoneId })
          );
        });
      }}
      processingCount={processingCount}
    />
  );
};

export default SetZoneForm;
