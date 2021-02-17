import { useEffect } from "react";

import { Select, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  defaultOption?: { label: string; value: string } | null;
  filterFunction?: (vlan: VLAN) => boolean;
} & FormikFieldProps;

export const VLANSelect = ({
  defaultOption = { label: "Select VLAN", value: "" },
  filterFunction,
  name,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  let vlans: VLAN[] = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!vlansLoaded) {
    return <Spinner />;
  }

  if (vlans && filterFunction) {
    vlans = vlans.filter(filterFunction);
  }

  const vlanOptions = vlans.map((vlan) => ({
    label: getVLANDisplay(vlan),
    value: vlan.id.toString(),
  }));

  if (defaultOption) {
    vlanOptions.unshift(defaultOption);
  }

  return (
    <FormikField
      component={Select}
      label="VLAN"
      name={name}
      options={vlanOptions}
      {...props}
    />
  );
};

export default VLANSelect;
