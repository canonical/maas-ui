import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import { useFetchActions } from "app/base/hooks";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
  valueKey?: "name" | "id";
} & HTMLProps<HTMLSelectElement>;

export const ResourcePoolSelect = ({
  disabled = false,
  label = "Resource pool",
  name,
  valueKey = "name",
  ...props
}: Props): JSX.Element => {
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);

  useFetchActions([resourcePoolActions.fetch]);

  return (
    <FormikField
      component={Select}
      disabled={!resourcePoolsLoaded || disabled}
      label={label}
      name={name}
      options={[
        { label: "Select resource pool", value: "", disabled: true },
        ...resourcePools.map((resourcePool) => ({
          key: `resource-pool-${resourcePool.id}`,
          label: resourcePool.name,
          value: resourcePool[valueKey],
        })),
      ]}
      {...props}
    />
  );
};

export default ResourcePoolSelect;
