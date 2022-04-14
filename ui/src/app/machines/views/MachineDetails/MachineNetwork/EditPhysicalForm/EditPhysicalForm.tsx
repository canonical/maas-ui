import { useCallback, useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { networkFieldsSchema } from "../NetworkFields/NetworkFields";

import EditPhysicalFields from "./EditPhysicalFields";
import type { EditPhysicalValues } from "./types";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useIsAllNetworkingDisabled } from "app/base/hooks";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineDetails } from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type {
  NetworkInterface,
  NetworkLink,
  UpdateInterfaceParams,
} from "app/store/types/node";
import {
  getInterfaceIPAddress,
  getInterfaceSubnet,
  getLinkFromNic,
  getLinkMode,
} from "app/store/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { preparePayload } from "app/utils";

type Props = {
  close: () => void;
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
  systemId: MachineDetails["system_id"];
};

const InterfaceSchema = Yup.object().shape({
  ...networkFieldsSchema,
  interface_speed: Yup.number().nullable(),
  link_speed: Yup.number().nullable(),
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

const EditPhysicalForm = ({
  close,
  linkId,
  nicId,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const nic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const link = getLinkFromNic(nic, linkId);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingInterface",
    "updateInterface",
    () => close()
  );

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!isMachineDetails(machine) || !nic) {
    return <Spinner />;
  }

  const subnet = getInterfaceSubnet(
    machine,
    subnets,
    fabrics,
    vlans,
    isAllNetworkingDisabled,
    nic,
    link
  );
  const ipAddress = getInterfaceIPAddress(machine, fabrics, vlans, nic, link);

  return (
    <Formik<EditPhysicalValues>
      initialValues={{
        fabric: vlan?.fabric || "",
        // Convert the speeds to GB.
        interface_speed: isNaN(Number(nic.interface_speed))
          ? 0
          : nic.interface_speed / 1000,
        ip_address: ipAddress || "",
        // The current link is required to update the subnet and ip address.
        link_id: linkId || "",
        link_speed: isNaN(Number(nic.link_speed)) ? 0 : nic.link_speed / 1000,
        mac_address: nic.mac_address,
        mode: getLinkMode(link),
        name: nic.name,
        subnet: subnet?.id || "",
        tags: nic.tags,
        vlan: nic.vlan_id,
      }}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        type Payload = EditPhysicalValues & {
          interface_id: NetworkInterface["id"];
          system_id: Machine["system_id"];
        };
        const payload: Payload = preparePayload({
          ...values,
          interface_id: nic.id,
          system_id: systemId,
        });
        // Convert the speeds back from GB.
        if (!isNaN(Number(payload.link_speed))) {
          payload.link_speed = Number(payload.link_speed) * 1000;
        }
        if (!isNaN(Number(payload.interface_speed))) {
          payload.interface_speed = Number(payload.interface_speed) * 1000;
        }
        dispatch(
          machineActions.updateInterface(payload as UpdateInterfaceParams)
        );
      }}
      validationSchema={InterfaceSchema}
    >
      <FormikFormContent<EditPhysicalValues, MachineEventErrors>
        cleanup={cleanup}
        errors={errors}
        onSaveAnalytics={{
          action: "Save physical interface",
          category: "Machine details networking",
          label: "Edit physical interface form",
        }}
        onCancel={close}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel="Save interface"
      >
        <EditPhysicalFields nic={nic} />
      </FormikFormContent>
    </Formik>
  );
};

export default EditPhysicalForm;
