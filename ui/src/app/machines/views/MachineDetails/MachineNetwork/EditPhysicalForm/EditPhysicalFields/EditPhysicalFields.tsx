import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import NetworkFields from "../../NetworkFields";
import type { EditPhysicalValues } from "../types";

import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import TagField from "app/base/components/TagField";
import type { NetworkInterface } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";

type Props = {
  nic: NetworkInterface | null;
};

const generateCaution = (values: EditPhysicalValues) =>
  values.link_speed > values.interface_speed
    ? "Link speed should not be higher than interface speed"
    : null;

const EditPhysicalFields = ({ nic }: Props): JSX.Element | null => {
  const { values } = useFormikContext<EditPhysicalValues>();
  if (!nic) {
    return null;
  }
  return (
    <Row>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">
          Physical details
        </h3>
        <FormikField label="Name" type="text" name="name" />
        <MacAddressField label="MAC address" name="mac_address" />
        <TagField />
        <FormikField
          caution={generateCaution(values)}
          label="Link speed (Gbps)"
          type="text"
          name="link_speed"
          disabled={!nic.link_connected}
        />
        <FormikField
          label="Interface speed (Gbps)"
          type="text"
          name="interface_speed"
          disabled={!nic.link_connected}
        />
      </Col>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">Network</h3>
        <NetworkFields editing interfaceType={NetworkInterfaceTypes.PHYSICAL} />
      </Col>
    </Row>
  );
};

export default EditPhysicalFields;
