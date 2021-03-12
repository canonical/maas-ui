import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import NetworkFields from "../../NetworkFields";
import BondModeSelect from "../BondModeSelect";
import HashPolicySelect from "../HashPolicySelect";
import LACPRateSelect from "../LACPRateSelect";
import type { BondFormValues } from "../types";
import { LinkMonitoring } from "../types";

import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import TagField from "app/base/components/TagField";
import { BondMode } from "app/store/general/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";

const BondFormFields = (): JSX.Element | null => {
  const {
    handleChange,
    setFieldValue,
    values,
  } = useFormikContext<BondFormValues>();
  const showHashPolicy = [
    BondMode.BALANCE_XOR,
    BondMode.LINK_AGGREGATION,
    BondMode.BALANCE_TLB,
  ].includes(values.bond_mode);
  const showLACPRate = values.bond_mode === BondMode.LINK_AGGREGATION;
  const showMonitoring = values.linkMonitoring === LinkMonitoring.MII;
  return (
    <Row>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">Bond details</h3>
        <BondModeSelect defaultOption={null} name="bond_mode" required />
        {showHashPolicy && (
          <HashPolicySelect
            bondMode={values.bond_mode}
            defaultOption={null}
            name="bond_xmit_hash_policy"
          />
        )}
        {showLACPRate && (
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
          onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
            handleChange(evt);
            // Reset the link monitoring fields.
            setFieldValue("bond_downdelay", 0);
            setFieldValue("bond_miimon", 0);
            setFieldValue("bond_updelay", 0);
          }}
          options={[
            {
              label: "No link monitoring",
              value: "",
            },
            {
              label: "MII link monitoring",
              value: LinkMonitoring.MII,
            },
          ]}
        />
        {showMonitoring && (
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
