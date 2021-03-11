import { useEffect } from "react";

import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import NetworkFields from "../../NetworkFields";
import type { Selected } from "../../NetworkTable/types";
import BondModeSelect from "../BondModeSelect";
import HashPolicySelect from "../HashPolicySelect";
import LACPRateSelect from "../LACPRateSelect";
import type { BondFormValues } from "../types";
import { MIIOptions } from "../types";
import { getFirstSelected } from "../utils";

import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import TagField from "app/base/components/TagField";
import { BondMode } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { toFormikNumber } from "app/utils";

type Props = {
  selected: Selected[];
  systemId: Machine["system_id"];
};

const BondFormFields = ({ selected, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { values, setFieldValue } = useFormikContext<BondFormValues>();
  const { primary } = values;

  useEffect(() => {
    // If the interface that is marked as primary becomes unselected then set a
    // new primary.
    if (!selected.find(({ nicId }) => nicId === toFormikNumber(primary))) {
      const firstSelected = machine
        ? getFirstSelected(machine, selected)
        : null;
      setFieldValue("primary", firstSelected?.nicId?.toString());
    }
  }, [machine, primary, selected, setFieldValue]);

  return (
    <Row>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">Bond details</h3>
        <BondModeSelect defaultOption={null} name="bond_mode" required />
        {[
          BondMode.BALANCE_XOR,
          BondMode.LINK_AGGREGATION,
          BondMode.BALANCE_TLB,
        ].includes(values.bond_mode) && (
          <HashPolicySelect
            bondMode={values.bond_mode}
            defaultOption={null}
            name="bond_xmit_hash_policy"
          />
        )}
        {values.bond_mode === BondMode.LINK_AGGREGATION && (
          <LACPRateSelect defaultOption={null} name="bond_lacp_rate" />
        )}
        <FormikField label="Bond name" name="name" type="text" />
        <TagField className="u-sv2" />
        <h3 className="p-heading--five u-no-margin--bottom">
          Advanced options
        </h3>
        <MacAddressField label="MAC address" name="mac_address" />
        <FormikField
          component={Select}
          label="Link monitoring"
          name="linkMonitoring"
          options={[
            {
              label: "No link monitoring",
              value: "",
            },
            {
              label: "MII link monitoring",
              value: MIIOptions.MII,
            },
          ]}
        />
        {values.linkMonitoring === MIIOptions.MII && (
          <>
            <FormikField
              component={Input}
              label="Monitoring frequency (ms)"
              name="bond_miimon"
              type="text"
            />
            <FormikField
              component={Input}
              label="Updelay (ms)"
              name="bond_updelay"
              type="text"
            />
            <FormikField
              component={Input}
              label="Downdelay (ms)"
              name="bond_downdelay"
              type="text"
            />
          </>
        )}
      </Col>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">Network</h3>
        <NetworkFields
          interfaceType={NetworkInterfaceTypes.BOND}
          fabricDisabled
          vlanDisabled
        />
      </Col>
    </Row>
  );
};

export default BondFormFields;
