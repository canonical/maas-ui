import { useEffect } from "react";

import { Select } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import { simpleSortByKey } from "app/utils";

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

  useEffect(() => {
    dispatch(spaceActions.fetch());
  }, [dispatch]);

  return (
    <FormikField
      component={Select}
      disabled={!spacesLoaded || disabled}
      label={label}
      name={name}
      options={[
        ...(defaultOption ? [defaultOption] : []),
        ...spaces
          .map((space) => ({
            label: space.name,
            value: space.id.toString(),
          }))
          .sort(simpleSortByKey("label", { alphanumeric: true })),
      ]}
      {...props}
    />
  );
};

export default SpaceSelect;
