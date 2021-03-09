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

export const MinimumKernelSelect = ({
  disabled = false,
  label = "Minimum kernel",
  name,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const hweKernels = useSelector(generalSelectors.hweKernels.get);
  const hweKernelsLoaded = useSelector(generalSelectors.hweKernels.loaded);

  useEffect(() => {
    dispatch(generalActions.fetchHweKernels());
  }, [dispatch]);

  return (
    <FormikField
      component={Select}
      disabled={!hweKernelsLoaded || disabled}
      label={label}
      name={name}
      options={[
        {
          label: "Select minimum kernel",
          value: null,
          disabled: true,
        },
        { label: "No minimum kernel", value: "" },
        ...hweKernels.map((kernel) => ({
          key: `kernel-${kernel[1]}`,
          label: kernel[1],
          value: kernel[0],
        })),
      ]}
      {...props}
    />
  );
};

export default MinimumKernelSelect;
