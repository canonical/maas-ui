import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";

type Props = {
  defaultOption?: { label: string; value: string } | null;
} & FormikFieldProps;

export const FabricSelect = ({
  defaultOption = { label: "Select fabric", value: "" },
  name,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const fabrics: Fabric[] = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);

  useEffect(() => {
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  if (!fabricsLoaded) {
    return <Spinner />;
  }

  const fabricOptions = fabrics.map((fabric) => ({
    label: fabric.name,
    value: fabric.id.toString(),
  }));

  if (defaultOption) {
    fabricOptions.unshift(defaultOption);
  }

  return (
    <DynamicSelect
      label="Fabric"
      name={name}
      options={fabricOptions}
      {...props}
    />
  );
};

export default FabricSelect;
