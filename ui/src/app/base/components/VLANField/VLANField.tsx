import { useEffect } from "react";

import { Select, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = Partial<FormikFieldProps>;

export const VLANField = ({ ...props }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const vlans: VLAN[] = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!vlansLoaded) {
    return <Spinner />;
  }

  return (
    <FormikField
      component={Select}
      label="VLAN"
      name="vlan"
      options={vlans.map((vlan) => ({
        label: getVLANDisplay(vlan),
        value: vlan.id,
      }))}
      {...props}
    />
  );
};

export default VLANField;
