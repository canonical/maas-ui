import { useEffect } from "react";
import type { HTMLProps } from "react";

import { Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import { actions as generalActions } from "app/store/general";
import generalSelectors from "app/store/general/selectors";

type Props = {
  disabled?: boolean;
  label?: string;
  name: string;
} & HTMLProps<HTMLSelectElement>;

export const ArchitectureSelect = ({
  disabled = false,
  label = "Architecture",
  name,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const architectures = useSelector(generalSelectors.architectures.get);
  const architecturesLoaded = useSelector(
    generalSelectors.architectures.loaded
  );

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
  }, [dispatch]);

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
