import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useCycled, useSendAnalyticsWhen } from "@/app/base/hooks";
import { deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import type {
  Device,
  DeviceMeta,
  DeviceNetworkInterface,
} from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import { formatErrors } from "@/app/utils";

type Props = {
  closeForm: () => void;
  nicId: DeviceNetworkInterface["id"];
  systemId: Device[DeviceMeta.PK];
};

const RemoveInterface = ({
  closeForm,
  nicId,
  systemId,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const deletingInterface = useSelector((state: RootState) =>
    deviceSelectors.getStatusForDevice(state, systemId, "deletingInterface")
  );
  const deleteInterfaceError = useSelector((state: RootState) =>
    deviceSelectors.eventErrorsForDevices(state, systemId, "deleteInterface")
  )[0]?.error;
  const [deletedInterface] = useCycled(
    !deletingInterface && !deleteInterfaceError
  );
  useSendAnalyticsWhen(
    deletedInterface,
    "Device network",
    "Remove interface",
    "Remove"
  );
  useEffect(() => {
    if (deletedInterface) {
      closeForm();
    }
  }, [closeForm, deletedInterface]);

  return (
    <>
      {deleteInterfaceError ? (
        <Notification severity="negative">
          <span data-testid="error-message">
            {formatErrors(deleteInterfaceError)}
          </span>
        </Notification>
      ) : null}
      <ModelActionForm
        aria-label="Remove interface"
        initialValues={{}}
        modelType="interface"
        onCancel={closeForm}
        onSubmit={() => {
          dispatch(deviceActions.cleanup());
          dispatch(
            deviceActions.deleteInterface({
              interface_id: nicId,
              system_id: systemId,
            })
          );
        }}
        saving={deletingInterface}
        submitLabel="Remove"
      />
    </>
  );
};

export default RemoveInterface;
