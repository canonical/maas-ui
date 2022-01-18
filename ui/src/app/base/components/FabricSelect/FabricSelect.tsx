import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";

type Props = {
  defaultOption?: { label: string; value: string; disabled?: boolean } | null;
} & FormikFieldProps;

export const FabricSelect = ({
  defaultOption = { label: "Select fabric", value: "", disabled: true },
  name,
  label = "Fabric",
  disabled,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);

  useEffect(() => {
    if (!fabricsLoaded) dispatch(fabricActions.fetch());
  }, [dispatch, fabricsLoaded]);

  return (
    <DynamicSelect
      disabled={!fabricsLoaded || disabled}
      label={label}
      name={name}
      options={[
        ...(defaultOption ? [defaultOption] : []),
        ...fabrics.map((fabric) => ({
          label: fabric.name,
          value: fabric.id.toString(),
        })),
      ]}
      {...props}
    />
  );
};

export default FabricSelect;
