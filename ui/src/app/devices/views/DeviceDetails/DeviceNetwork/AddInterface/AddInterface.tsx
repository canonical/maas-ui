import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddInterfaceFields from "./AddInterfaceFields";

import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import { useCycled, useScrollOnRender } from "app/base/hooks";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type {
  CreateInterfaceParams,
  Device,
  DeviceMeta,
} from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import { getNextNicName } from "app/store/utils";
import { preparePayload } from "app/utils";

type Props = {
  closeForm: () => void;
  systemId: Device[DeviceMeta.PK];
};

export type AddInterfaceValues = {
  ip_address: string;
  ip_assignment: DeviceIpAssignment;
  mac_address: string;
  name: string;
  subnet: Subnet[SubnetMeta.PK] | "";
  tags: string[];
};

const AddInterfaceSchema = Yup.object().shape({
  ip_address: Yup.string().when("ip_assignment", {
    is: (ipAssignment: DeviceIpAssignment) =>
      ipAssignment === DeviceIpAssignment.STATIC ||
      ipAssignment === DeviceIpAssignment.EXTERNAL,
    then: Yup.string().required("IP address is required"),
  }),
  ip_assignment: Yup.string().required("IP assignment is required"),
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  name: Yup.string(),
  subnet: Yup.number().when("ip_assignment", {
    is: (ipAssignment: DeviceIpAssignment) =>
      ipAssignment === DeviceIpAssignment.STATIC,
    then: Yup.number().required("Subnet is required"),
  }),
  tags: Yup.array().of(Yup.string()),
});

const AddInterface = ({ closeForm, systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const errors = useSelector(deviceSelectors.errors);
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
  const nextName = getNextNicName(device, NetworkInterfaceTypes.PHYSICAL);
  return (
    <div ref={onRenderRef}>
      <FormCard sidebar={false}>
        <FormikForm<AddInterfaceValues>
          cleanup={deviceActions.cleanup}
          errors={errors}
          initialValues={{
            ip_address: "",
            ip_assignment: DeviceIpAssignment.DYNAMIC,
            mac_address: "",
            name: nextName || "",
            subnet: "",
            tags: [],
          }}
          onSaveAnalytics={{
            action: "Add interface",
            category: "Device details networking",
            label: "Add interface form",
          }}
          onCancel={closeForm}
          onSubmit={(values) => {
            resetCreatedInterface();
            dispatch(deviceActions.cleanup());
            const payload = preparePayload({
              ...values,
              system_id: device.system_id,
            }) as CreateInterfaceParams;
            dispatch(deviceActions.createInterface(payload));
          }}
          onSuccess={closeForm}
          saved={saved}
          saving={creatingInterface}
          submitLabel="Save interface"
          validationSchema={AddInterfaceSchema}
        >
          <AddInterfaceFields />
        </FormikForm>
      </FormCard>
    </div>
  );
};

export default AddInterface;
