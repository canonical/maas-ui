import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FormikField from "@/app/base/components/FormikField";
import { useFetchActions } from "@/app/base/hooks";
import { actions as generalActions } from "@/app/store/general";
import { architectures as architecturesSelectors } from "@/app/store/general/selectors";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
} & HTMLProps<HTMLSelectElement>;

export enum Labels {
  DefaultLabel = "Architecture",
}

export const ArchitectureSelect = ({
  disabled = false,
  label = Labels.DefaultLabel,
  name,
  ...props
}: Props): JSX.Element => {
  const architectures = useSelector(architecturesSelectors.get);
  const architecturesLoaded = useSelector(architecturesSelectors.loaded);

  useFetchActions([generalActions.fetchArchitectures]);

  return (
    <FormikField
      component={Select}
      disabled={!architecturesLoaded || disabled}
      label={label}
      name={name}
      options={[
        {
          label: "Select architecture",
          value: "",
          disabled: true,
        },
        ...architectures.map((architecture) => ({
          key: architecture,
          label: architecture,
          value: architecture,
        })),
      ]}
      {...props}
    />
  );
};

export default ArchitectureSelect;
