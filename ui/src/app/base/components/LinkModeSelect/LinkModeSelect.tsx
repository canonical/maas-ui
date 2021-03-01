import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import {
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/machine/types";
import { LINK_MODE_DISPLAY } from "app/store/machine/utils/networking";
import type { Subnet } from "app/store/subnet/types";

type Props = {
  defaultOption?: { label: string; value: string } | null;
  interfaceType: NetworkInterfaceTypes;
  subnet?: Subnet["id"] | null;
} & FormikFieldProps;

const getAvailableLinkModes = (
  interfaceType: NetworkInterfaceTypes | null,
  subnet?: Subnet["id"] | null
): NetworkLinkMode[] => {
  // If a subnet has not been chosen then the only allowed mode is LINK_UP.
  if (!subnet) {
    return [NetworkLinkMode.LINK_UP];
  }
  const modes = [NetworkLinkMode.AUTO, NetworkLinkMode.STATIC];
  const isAlias = interfaceType === NetworkInterfaceTypes.ALIAS;
  if (!isAlias) {
    modes.push(NetworkLinkMode.LINK_UP);
    // Can't run DHCP twice on one NIC.
    modes.push(NetworkLinkMode.DHCP);
  }
  return modes;
};

export const LinkModeSelect = ({
  defaultOption = { label: "Select IP mode", value: "" },
  interfaceType,
  name,
  subnet,
  ...props
}: Props): JSX.Element => {
  const availableModes = getAvailableLinkModes(interfaceType, subnet);
  const modeOptions = availableModes.map((mode) => ({
    label: LINK_MODE_DISPLAY[mode],
    value: mode.toString(),
  }));

  if (defaultOption) {
    modeOptions.unshift(defaultOption);
  }

  return (
    <DynamicSelect
      label="IP mode"
      name={name}
      options={modeOptions}
      {...props}
    />
  );
};

export default LinkModeSelect;
