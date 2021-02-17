import { useEffect } from "react";

import { Select, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";

type Props = Partial<FormikFieldProps>;

export const FabricField = ({ ...props }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);

  useEffect(() => {
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  if (!fabricsLoaded) {
    return <Spinner />;
  }

  return (
    <FormikField
      component={Select}
      label="Fabric"
      name="fabric"
      options={fabrics.map((fabric) => ({
        label: fabric.name,
        value: fabric.id,
      }))}
      {...props}
    />
  );
};

export default FabricField;
