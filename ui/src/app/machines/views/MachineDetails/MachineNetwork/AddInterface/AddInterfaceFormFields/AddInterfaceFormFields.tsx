import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { AddInterfaceValues } from "../types";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import LinkModeSelect from "app/base/components/LinkModeSelect";
import MacAddressField from "app/base/components/MacAddressField";
import SubnetSelect from "app/base/components/SubnetSelect";
import TagField from "app/base/components/TagField";
import VLANSelect from "app/base/components/VLANSelect";
import fabricSelectors from "app/store/fabric/selectors";
import { NetworkLinkMode } from "app/store/machine/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";

const fieldOrder = ["fabric", "vlan", "subnet", "mode", "ip_address"];

const AddInterfaceFormFields = (): JSX.Element | null => {
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const { setFieldValue, values } = useFormikContext<AddInterfaceValues>();
  const resetFollowingFields = (name: keyof AddInterfaceValues) => {
    // Reset all fields after this one.
    const position = fieldOrder.indexOf(name);
    for (let i = position + 1; i < fieldOrder.length; i++) {
      setFieldValue(fieldOrder[i], "");
    }
  };
  return (
    <>
      <Row>
        <Col size="6">
          <FormikField label="Name" type="text" name="name" />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col size="6">
          <Input
            disabled
            label="Type"
            value="Physical"
            type="text"
            name="type"
          />
          <MacAddressField label="MAC address" name="mac_address" />
          <TagField />
        </Col>
        <Col size="6">
          <FabricSelect
            name="fabric"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = evt.target;
              // Manually set the value because we've overwritten the onChange.
              setFieldValue("fabric", Number(value));
              if (value || typeof value === "number") {
                const fabric = fabrics.find(({ id }) => id === Number(value));
                // Update the VLAN on the node to be the default VLAN for that
                // fabric.
                setFieldValue("vlan", fabric?.default_vlan_id);
                resetFollowingFields("vlan");
              }
            }}
          />
          <VLANSelect
            filterFunction={(vlan: VLAN) => vlan.fabric === values.fabric}
            name="vlan"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = evt.target;
              // Manually set the value because we've overwritten the onChange.
              setFieldValue("vlan", Number(value));
              resetFollowingFields("vlan");
            }}
          />
          <SubnetSelect
            defaultOption={{
              label: "Unconfigured",
              value: "",
            }}
            filterFunction={(subnet: Subnet) => subnet.vlan === values.vlan}
            name="subnet"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = evt.target;
              // Manually set the value so that the next fields get reset.
              setFieldValue("subnet", Number(value));
              resetFollowingFields("subnet");
            }}
          />
          {values.subnet ? (
            <LinkModeSelect
              name="mode"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = evt.target;
                // Manually set the value because we've overwritten the onChange.
                setFieldValue("mode", value as NetworkLinkMode);
                if (value === NetworkLinkMode.STATIC) {
                  const subnet = subnets.find(
                    // Formik values eventually resolve to the correct types,
                    // meanwile we need to force the subnet value to be a number
                    // to compare against the ids in the store.
                    ({ id }) => id === Number(values.subnet)
                  );
                  setFieldValue(
                    "ip_address",
                    subnet?.statistics.first_address || ""
                  );
                } else {
                  setFieldValue("ip_address", "");
                }
              }}
            />
          ) : null}
          {values.mode === NetworkLinkMode.STATIC ? (
            <FormikField label="IP address" type="text" name="ip_address" />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default AddInterfaceFormFields;
