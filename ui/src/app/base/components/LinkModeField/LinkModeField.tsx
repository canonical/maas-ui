import { Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { NetworkLinkMode } from "app/store/machine/types";
import { LINK_MODE_DISPLAY } from "app/store/machine/utils/networking";

type Props = Partial<FormikFieldProps>;

export const LinkModeField = ({ ...props }: Props): JSX.Element => (
  <FormikField
    component={Select}
    label="IP mode"
    name="mode"
    options={Object.values(NetworkLinkMode).map((mode) => ({
      label: LINK_MODE_DISPLAY[mode],
      value: mode,
    }))}
    {...props}
  />
);

export default LinkModeField;
