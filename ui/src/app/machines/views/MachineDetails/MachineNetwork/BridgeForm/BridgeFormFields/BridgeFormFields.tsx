import { Col, Icon, Row, Select, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";

import NetworkFields from "../../NetworkFields";
import type { BridgeFormValues } from "../types";

import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import SwitchField from "app/base/components/SwitchField";
import TagField from "app/base/components/TagField";
import { BridgeType, NetworkInterfaceTypes } from "app/store/machine/types";

const BridgeFormFields = (): JSX.Element | null => {
  const { values } = useFormikContext<BridgeFormValues>();
  return (
    <Row>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">Bridge details</h3>
        <FormikField label="Bridge name" type="text" name="name" />
        <FormikField
          component={Select}
          label="Bridge type"
          name="bridge_type"
          options={[
            { label: "Standard", value: BridgeType.STANDARD },
            { label: "Open vSwitch (ovs)", value: BridgeType.OVS },
          ]}
        />
        <MacAddressField label="MAC address" name="mac_address" />
        <TagField className="u-sv2" />
        <h3 className="p-heading--five u-no-margin--bottom">
          Advanced options
        </h3>
        <FormikField
          component={SwitchField}
          label={
            <>
              STP{" "}
              <Tooltip
                message="Controls the participation of this bridge in the spanning tree protocol."
                position="top-left"
              >
                <Icon name="help" />
              </Tooltip>
            </>
          }
          name="bridge_stp"
        />
        {values.bridge_stp ? (
          <FormikField
            label="Forward delay (ms)"
            type="text"
            name="bridge_fd"
          />
        ) : null}
      </Col>
      <Col size="6">
        <h3 className="p-heading--five u-no-margin--bottom">Network</h3>
        <NetworkFields interfaceType={NetworkInterfaceTypes.PHYSICAL} />
      </Col>
    </Row>
  );
};

export default BridgeFormFields;
