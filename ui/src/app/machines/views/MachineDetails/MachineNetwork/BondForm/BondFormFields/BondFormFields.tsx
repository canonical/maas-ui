import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import NetworkFields from "../../NetworkFields";
import type { Selected } from "../../NetworkTable/types";
import BondModeSelect from "../BondModeSelect";
import HashPolicySelect from "../HashPolicySelect";
import LACPRateSelect from "../LACPRateSelect";
import type { BondFormValues } from "../types";
import { MacSource, LinkMonitoring } from "../types";

import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import TagField from "app/base/components/TagField";
import { BondMode } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  getInterfaceById,
  getInterfaceName,
  getLinkFromNic,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  selected: Selected[];
  systemId: Machine["system_id"];
};

type Option = {
  label: string;
  value: string;
};

const getMacOptions = (machine: Machine, selected: Selected[]) =>
  selected.reduce<Option[]>((options, { nicId, linkId }) => {
    const nic = getInterfaceById(machine, nicId, linkId);
    const link = getLinkFromNic(nic, linkId);
    if (nic) {
      options.push({
        label: getInterfaceName(machine, nic, link),
        value: nic.mac_address,
      });
    }
    return options;
  }, []);

const BondFormFields = ({ selected, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const {
    handleChange,
    setFieldValue,
    values,
  } = useFormikContext<BondFormValues>();
  if (!machine) {
    return null;
  }
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
        <h3 className="p-heading--five">Advanced options</h3>
        <FormikField
          label="Use MAC address from bond member"
          name="macSource"
          onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
            handleChange(evt);
            // Reset the mac address field from the select box.
            setFieldValue("mac_address", values.macNic);
          }}
          type="radio"
          value={MacSource.NIC}
        />
        <FormikField
          component={Select}
          disabled={values.macSource !== MacSource.NIC}
          label={null}
          name="macNic"
          onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
            handleChange(evt);
            // Fill the mac addres field from the value of this select.
            setFieldValue("mac_address", evt.target.value);
          }}
          options={getMacOptions(machine, selected)}
          wrapperClassName="u-nudge-right--x-large u-sv2"
        />
        <FormikField
          label="Manual MAC address"
          name="macSource"
          type="radio"
          value={MacSource.MANUAL}
        />
        <MacAddressField
          disabled={values.macSource !== MacSource.MANUAL}
          label={null}
          name="mac_address"
          wrapperClassName="u-nudge-right--x-large"
        />
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
