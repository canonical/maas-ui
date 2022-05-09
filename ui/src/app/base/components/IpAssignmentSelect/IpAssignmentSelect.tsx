import { Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { DeviceIpAssignment } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";

type Props = {
  includeStatic?: boolean;
} & Omit<FormikFieldProps<typeof Select>, "component" | "options">;

export const IpAssignmentSelect = ({
  includeStatic = true,
  label = "IP assignment",
  ...props
}: Props): JSX.Element => {
  return (
    <FormikField
      component={Select}
      label={label}
      options={[
        { disabled: true, label: "Select IP assignment", value: "" },
        {
          label: getIpAssignmentDisplay(DeviceIpAssignment.DYNAMIC),
          value: DeviceIpAssignment.DYNAMIC,
        },
        ...(includeStatic
          ? [
              {
                label: getIpAssignmentDisplay(DeviceIpAssignment.STATIC),
                value: DeviceIpAssignment.STATIC,
              },
            ]
          : []),
        {
          label: getIpAssignmentDisplay(DeviceIpAssignment.EXTERNAL),
          value: DeviceIpAssignment.EXTERNAL,
        },
      ]}
      {...props}
    />
  );
};

export default IpAssignmentSelect;
