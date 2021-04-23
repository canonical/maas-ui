import { useCallback, useEffect } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import NetworkFields, {
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";
import type { NetworkValues } from "../NetworkFields/NetworkFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import TagField from "app/base/components/TagField";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  MachineDetails,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  getInterfaceIPAddress,
  getInterfaceSubnet,
  getLinkMode,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import { getInterfaceTypeText } from "app/store/machine/utils/networking";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { preparePayload } from "app/utils";

type Props = {
  close: () => void;
  nic?: NetworkInterface | null;
  link?: NetworkLink | null;
  interfaceType: NetworkInterfaceTypes.ALIAS | NetworkInterfaceTypes.VLAN;
  systemId: MachineDetails["system_id"];
};

export type EditAliasOrVlanValues = {
  tags?: NetworkInterface["tags"];
} & NetworkValues;

const AliasOrVlanSchema = Yup.object().shape({
  ...networkFieldsSchema,
  tags: Yup.array().of(Yup.string()),
});

const EditAliasOrVlanForm = ({
  close,
  interfaceType,
  link,
  nic,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const isAlias = interfaceType === NetworkInterfaceTypes.ALIAS;
  const isVLAN = interfaceType === NetworkInterfaceTypes.VLAN;
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

  if (!nic || !machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
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
  const interfaceTypeDisplay = getInterfaceTypeText(machine, nic, link);
  return (
    <FormikForm
      buttons={FormCardButtons}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        fabric: vlan?.fabric,
        ip_address: ipAddress,
        mode: getLinkMode(link),
        subnet: subnet?.id,
        vlan: nic.vlan_id,
        ...(isVLAN ? { tags: nic.tags } : {}),
      }}
      onSaveAnalytics={{
        action: `Save ${interfaceType}`,
        category: "Machine details networking",
        label: `Edit ${interfaceType} form`,
      }}
      onCancel={close}
      onSubmit={(values: EditAliasOrVlanValues) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        type Payload = EditAliasOrVlanValues & {
          interface_id: NetworkInterface["id"];
          system_id: Machine["system_id"];
        };
        const payload: Payload = preparePayload({
          ...values,
          interface_id: nic.id,
          system_id: systemId,
          ...(isAlias ? { link_id: link?.id } : {}),
        });
        dispatch(machineActions.updateInterface(payload));
      }}
      resetOnSave
      saved={saved}
      saving={saving}
      submitLabel={`Save ${interfaceTypeDisplay}`}
      validationSchema={AliasOrVlanSchema}
    >
      <Row>
        {isVLAN ? (
          <Col size="6">
            <h3 className="p-heading--five u-no-margin--bottom">
              VLAN details
            </h3>
            <TagField />
          </Col>
        ) : null}
        <Col size="6">
          <h3 className="p-heading--five u-no-margin--bottom">Network</h3>
          <NetworkFields
            fabricDisabled={true}
            includeUnconfiguredSubnet={isVLAN}
            includeDefaultVlan={!isVLAN}
            interfaceType={interfaceType}
            vlanDisabled={isAlias}
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default EditAliasOrVlanForm;
