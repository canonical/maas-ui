import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FormikField from "@/app/base/components/FormikField";
import { useFetchActions } from "@/app/base/hooks";
import { actions as zoneActions } from "@/app/store/zone";
import zoneSelectors from "@/app/store/zone/selectors";
import type { Zone } from "@/app/store/zone/types";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
  valueKey?: keyof Zone;
} & HTMLProps<HTMLSelectElement>;

export enum Label {
  Zone = "Zone",
}

export const ZoneSelect = ({
  disabled = false,
  label = Label.Zone,
  name,
  valueKey = "name",
  ...props
}: Props): JSX.Element => {
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  useFetchActions([zoneActions.fetch]);

  return (
    <FormikField
      component={Select}
      disabled={!zonesLoaded || disabled}
      label={label}
      name={name}
      options={[
        { label: "Select zone", value: "", disabled: true },
        ...zones.map((zone) => ({
          key: `zone-${zone.id}`,
          label: zone.name,
          value: zone[valueKey],
        })),
      ]}
      {...props}
    />
  );
};

export default ZoneSelect;
