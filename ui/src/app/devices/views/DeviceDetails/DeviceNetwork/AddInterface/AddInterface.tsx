import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import InterfaceForm from "../InterfaceForm";

import FormCard from "app/base/components/FormCard";
import { useCycled, useScrollOnRender } from "app/base/hooks";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type {
  CreateInterfaceParams,
  Device,
  DeviceMeta,
} from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";
import { preparePayload } from "app/utils";

type Props = {
  closeForm: () => void;
  systemId: Device[DeviceMeta.PK];
};

const AddInterface = ({ closeForm, systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const creatingInterface = useSelector((state: RootState) =>
    deviceSelectors.getStatusForDevice(state, systemId, "creatingInterface")
  );
  const createInterfaceErrored =
    useSelector((state: RootState) =>
      deviceSelectors.eventErrorsForDevices(state, systemId, "createInterface")
    ).length > 0;
  const [createdInterface, resetCreatedInterface] = useCycled(
    !creatingInterface
  );
  const saved = createdInterface && !createInterfaceErrored;
  const onRenderRef = useScrollOnRender<HTMLDivElement>();

  if (!isDeviceDetails(device)) {
    return <Spinner data-testid="loading-device-details" text="Loading..." />;
  }
  return (
    <div ref={onRenderRef}>
      <FormCard sidebar={false}>
        <InterfaceForm
          closeForm={closeForm}
          onSaveAnalytics={{
            action: "Add interface",
            category: "Device details networking",
            label: "Add interface form",
          }}
          onSubmit={(values) => {
            resetCreatedInterface();
            dispatch(deviceActions.cleanup());
            const payload = preparePayload({
              ...values,
              system_id: device.system_id,
            }) as CreateInterfaceParams;
            dispatch(deviceActions.createInterface(payload));
          }}
          saved={saved}
          saving={creatingInterface}
          systemId={systemId}
        />
      </FormCard>
    </div>
  );
};

export default AddInterface;
