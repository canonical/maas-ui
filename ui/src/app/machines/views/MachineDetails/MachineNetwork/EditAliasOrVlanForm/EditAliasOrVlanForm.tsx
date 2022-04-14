import { useCallback, useEffect } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import NetworkFields, {
  networkFieldsSchema,
} from "../NetworkFields/NetworkFields";
import type { NetworkValues } from "../NetworkFields/NetworkFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import TagNameField from "app/base/components/TagNameField";
import { useIsAllNetworkingDisabled } from "app/base/hooks";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type {
  NetworkInterface,
  NetworkLink,
  UpdateInterfaceParams,
} from "app/store/types/node";
import {
  getInterfaceTypeText,
  getInterfaceIPAddress,
  getInterfaceSubnet,
  getLinkMode,
} from "app/store/utils";
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

  if (!nic || !isMachineDetails(machine)) {
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
    <Formik
      initialValues={{
        fabric: vlan?.fabric || "",
        ip_address: ipAddress || "",
        mode: getLinkMode(link),
        subnet: subnet?.id || "",
        vlan: nic.vlan_id,
        ...(isVLAN ? { tags: nic.tags } : {}),
      }}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        dispatch(cleanup());
        const payload = preparePayload({
          ...values,
          interface_id: nic.id,
          link_id: link?.id,
          system_id: systemId,
        }) as UpdateInterfaceParams;
        dispatch(machineActions.updateInterface(payload));
      }}
      validationSchema={AliasOrVlanSchema}
    >
      <FormikFormContent<EditAliasOrVlanValues, MachineEventErrors>
        cleanup={cleanup}
        errors={errors}
        onSaveAnalytics={{
          action: `Save ${interfaceType}`,
          category: "Machine details networking",
          label: `Edit ${interfaceType} form`,
        }}
        onCancel={close}
        resetOnSave
        saved={saved}
        saving={saving}
        submitLabel={`Save ${interfaceTypeDisplay}`}
      >
        <Row>
          {isVLAN ? (
            <Col size={6}>
              <h3 className="p-heading--5 u-no-margin--bottom">VLAN details</h3>
              <TagNameField />
            </Col>
          ) : null}
          <Col size={6}>
            <h3 className="p-heading--5 u-no-margin--bottom">Network</h3>
            <NetworkFields
              fabricDisabled={true}
              includeUnconfiguredSubnet={isVLAN}
              includeDefaultVlan={!isVLAN}
              interfaceType={interfaceType}
              vlanDisabled={isAlias}
            />
          </Col>
        </Row>
      </FormikFormContent>
    </Formik>
  );
};

export default EditAliasOrVlanForm;
