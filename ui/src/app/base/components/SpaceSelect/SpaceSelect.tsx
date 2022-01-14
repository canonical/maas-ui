import { useEffect } from "react";

import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";

type Props = {
  defaultOption?: { label: string; value: string; disabled?: boolean } | null;
} & FormikFieldProps;

export const SpaceSelect = ({
  defaultOption = { label: "Select space", value: "", disabled: true },
  name,
  label = "Space",
  disabled,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const spaces = useSelector(spaceSelectors.all);
  const spacesLoaded = useSelector(spaceSelectors.loaded);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (!spacesLoaded) dispatch(spaceActions.fetch());
  }, [dispatch, spacesLoaded]);

  useEffect(() => {
    if (spacesLoaded) {
      setFieldValue(name, spaces[0]?.id?.toString());
    }
  }, [name, spacesLoaded, spaces, setFieldValue]);

  return (
    <FormikField
      component={Select}
      disabled={!spacesLoaded || disabled}
      label={label}
      name={name}
      options={[
        ...(defaultOption ? [defaultOption] : []),
        ...spaces.map((space) => ({
          label: space.name,
          value: space.id.toString(),
        })),
      ]}
      {...props}
    />
  );
};

export default SpaceSelect;
