import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import NetworkFields from "../../NetworkFields";
import type { AddAliasOrVlanValues } from "../types";

import TagField from "app/base/components/TagField";
import machineSelectors from "app/store/machine/selectors";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { MachineDetails, NetworkInterface } from "app/store/machine/types";
import { getNextNicName } from "app/store/machine/utils";
import { INTERFACE_TYPE_DISPLAY } from "app/store/machine/utils/networking";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import { toFormikNumber } from "app/utils";

type Props = {
  nic?: NetworkInterface | null;
  interfaceType: NetworkInterfaceTypes.ALIAS | NetworkInterfaceTypes.VLAN;
  systemId: MachineDetails["system_id"];
};

export const AddAliasOrVlanFields = ({
  nic,
  interfaceType,
  systemId,
}: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { values } = useFormikContext<AddAliasOrVlanValues>();
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, toFormikNumber(values.vlan))
  );
  const unusedVLANs = useSelector((state: RootState) =>
    vlanSelectors.getUnusedForInterface(state, machine, nic)
  );
  const isVLAN = interfaceType === NetworkInterfaceTypes.VLAN;
  const isAlias = interfaceType === NetworkInterfaceTypes.ALIAS;
  const nextNicName = getNextNicName(machine, interfaceType, nic, vlan?.vid);
  return (
    <Row>
      <Col size="6">
        <Input
          disabled
          label="Name"
          value={nextNicName || ""}
          type="text"
          name="name"
        />
        <Input
          disabled
          label="Type"
          value={INTERFACE_TYPE_DISPLAY[interfaceType]}
          type="text"
          name="type"
        />
        {isVLAN ? <TagField /> : null}
      </Col>
      <Col size="6">
        <NetworkFields
          fabricDisabled={true}
          includeUnconfiguredSubnet={isVLAN}
          interfaceType={interfaceType}
          vlanDisabled={isAlias}
          vlans={isVLAN ? unusedVLANs : null}
        />
      </Col>
    </Row>
  );
};

export default AddAliasOrVlanFields;
