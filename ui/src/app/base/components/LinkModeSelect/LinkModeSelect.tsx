import { Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { NetworkLinkMode } from "app/store/machine/types";
import { LINK_MODE_DISPLAY } from "app/store/machine/utils/networking";

type Props = {
  defaultOption?: { label: string; value: string } | null;
} & FormikFieldProps;

export const LinkModeSelect = ({
  defaultOption = { label: "Select IP mode", value: "" },
  name,
  ...props
}: Props): JSX.Element => {
  const modeOptions = Object.values(NetworkLinkMode).map((mode) => ({
    label: LINK_MODE_DISPLAY[mode],
    value: mode.toString(),
  }));

  if (defaultOption) {
    modeOptions.unshift(defaultOption);
  }

  return (
    <FormikField
      component={Select}
      label="IP mode"
      name={name}
      options={modeOptions}
      {...props}
    />
  );
};

export default LinkModeSelect;
