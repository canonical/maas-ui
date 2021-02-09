import { useEffect } from "react";
import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
  valueKey?: keyof ResourcePool;
} & HTMLProps<HTMLSelectElement>;

export const ResourcePoolSelect = ({
  disabled = false,
  label = "Resource pool",
  name,
  valueKey = "name",
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

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
