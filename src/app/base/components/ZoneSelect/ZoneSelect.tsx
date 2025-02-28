import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";

import { useZones } from "@/app/api/query/zones";
import type { ZoneResponse } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
  valueKey?: keyof ZoneResponse;
} & HTMLProps<HTMLSelectElement>;

export enum Label {
  Zone = "Zone",
}

export const ZoneSelect = ({
  disabled = false,
  label = Label.Zone,
  name,
  ...props
}: Props): JSX.Element => {
  const zones = useZones();

  return (
    <FormikField
      component={Select}
      disabled={zones.isPending || disabled}
      label={label}
      name={name}
      options={[
        { label: "Select zone", value: "", disabled: true },
        ...(zones.data?.items?.map((zone) => ({
          key: `zone-${zone.id}`,
          label: zone.name,
          value: zone.id,
        })) || []),
      ]}
      {...props}
    />
  );
};

export default ZoneSelect;
