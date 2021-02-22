import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import LinkModeSelect from "app/base/components/LinkModeSelect";
import SubnetSelect from "app/base/components/SubnetSelect";
import VLANSelect from "app/base/components/VLANSelect";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import { NetworkLinkMode } from "app/store/machine/types";
import type {
  NetworkInterface,
  NetworkLink,
  Vlan,
} from "app/store/machine/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";

export type NetworkValues = {
  ip_address?: NetworkLink["ip_address"];
  mode?: NetworkLinkMode;
  fabric: Vlan["fabric_id"];
  subnet?: NetworkLink["subnet_id"];
  vlan: NetworkInterface["vlan_id"];
};

/*


 */

/**
 * Formik values eventually resolve to the correct types,
 * meanwile we need to force the subnet value to be a number.
 */
const toNumber = (value: string | number): number | undefined => {
  if (typeof value === "number") {
    return value;
  }
  if (isNaN(parseInt(value, 10))) {
    // Formik requires number fields to be `undefined` when they have no value.
    return undefined;
  }
  return parseInt(value, 10);
};

const fieldOrder = ["fabric", "vlan", "subnet", "mode", "ip_address"];

type Props = {
  editing?: boolean;
};

const NetworkFields = ({ editing }: Props): JSX.Element | null => {
  const fabrics: Fabric[] = useSelector(fabricSelectors.all);
  const subnets: Subnet[] = useSelector(subnetSelectors.all);
  const { setFieldValue, values } = useFormikContext<NetworkValues>();
  const resetFollowingFields = (name: keyof NetworkValues) => {
    // Reset all fields after this one.
    const position = fieldOrder.indexOf(name);
    for (let i = position + 1; i < fieldOrder.length; i++) {
      let value: string;
      switch (fieldOrder[i]) {
        case "mode":
          value = editing ? NetworkLinkMode.AUTO : NetworkLinkMode.LINK_UP;
          break;

        default:
          value = "";
      }
      setFieldValue(fieldOrder[i], value);
    }
  };
  return (
    <>
      <FabricSelect
        name="fabric"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = evt.target;
          // Manually set the value because we've overwritten the onChange.
          setFieldValue("fabric", toNumber(value));
          if (value || typeof value === "number") {
            const fabric = fabrics.find(({ id }) => id === toNumber(value));
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
          setFieldValue("vlan", toNumber(value));
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
          setFieldValue("subnet", toNumber(value));
          resetFollowingFields("subnet");
        }}
      />
      {values.subnet ? (
        <LinkModeSelect
          defaultOption={null}
          name="mode"
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = evt.target;
            // Manually set the value because we've overwritten the onChange.
            setFieldValue("mode", value as NetworkLinkMode);
            if (value === NetworkLinkMode.STATIC) {
              const subnet = subnets.find(
                ({ id }) => id === toNumber(values.subnet)
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
    </>
  );
};

export default NetworkFields;
