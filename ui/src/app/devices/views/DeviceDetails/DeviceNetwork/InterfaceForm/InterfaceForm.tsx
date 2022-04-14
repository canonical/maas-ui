import { useEffect } from "react";

import type { PropsWithSpread } from "@canonical/react-components";
import { Spinner } from "@canonical/react-components";
import type { FormikConfig, FormikErrors } from "formik";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import InterfaceFormFields from "./InterfaceFormFields";

import type { Props as FormikFormContentProps } from "app/base/components/FormikFormContent";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useIsAllNetworkingDisabled } from "app/base/hooks";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type {
  Device,
  DeviceMeta,
  DeviceNetworkInterface,
} from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkLink } from "app/store/types/node";
import {
  getInterfaceSubnet,
  getLinkFromNic,
  getNextNicName,
} from "app/store/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type Props = PropsWithSpread<
  {
    closeForm: () => void;
    linkId?: NetworkLink["id"] | null;
    nicId?: DeviceNetworkInterface["id"] | null;
    onSubmit: FormikConfig<InterfaceFormValues>["onSubmit"];
    showTitles?: boolean;
    systemId: Device[DeviceMeta.PK];
  },
  Partial<
    Omit<
      FormikFormContentProps<
        InterfaceFormValues,
        FormikErrors<InterfaceFormValues>
      >,
      "onSubmit"
    >
  >
>;

export type InterfaceFormValues = {
  ip_address: string;
  ip_assignment: DeviceIpAssignment;
  mac_address: string;
  name: string;
  subnet: Subnet[SubnetMeta.PK] | "";
  tags: string[];
};

const InterfaceFormSchema = Yup.object().shape({
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

const InterfaceForm = ({
  closeForm,
  linkId,
  showTitles,
  nicId,
  onSubmit,
  systemId,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const nic = useSelector((state: RootState) =>
    deviceSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const link = getLinkFromNic(nic, linkId);
  const errors = useSelector(deviceSelectors.errors);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(device);

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!isDeviceDetails(device)) {
    return <Spinner data-testid="loading-device-details" text="Loading..." />;
  }
  const nextName = getNextNicName(device, NetworkInterfaceTypes.PHYSICAL);
  const subnet = getInterfaceSubnet(
    device,
    subnets,
    fabrics,
    vlans,
    isAllNetworkingDisabled,
    nic,
    link
  );
  return (
    <Formik
      initialValues={{
        ip_address: nic?.ip_address || "",
        ip_assignment: nic?.ip_assignment || DeviceIpAssignment.DYNAMIC,
        mac_address: nic?.mac_address || "",
        name: nic?.name || nextName || "",
        subnet: subnet?.id || "",
        tags: nic?.tags || [],
      }}
      onSubmit={onSubmit}
      validationSchema={InterfaceFormSchema}
    >
      <FormikFormContent<InterfaceFormValues>
        cleanup={deviceActions.cleanup}
        errors={errors}
        onCancel={closeForm}
        onSuccess={closeForm}
        submitLabel="Save interface"
        {...props}
      >
        <InterfaceFormFields showTitles={showTitles} />
      </FormikFormContent>
    </Formik>
  );
};

export default InterfaceForm;
