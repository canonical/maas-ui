import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  defaultOption?: { label: string; value: string } | null;
  fabric?: VLAN["fabric"];
  vlans?: VLAN[] | null;
} & FormikFieldProps;

export const VLANSelect = ({
  defaultOption = { label: "Select VLAN", value: "" },
  fabric,
  name,
  vlans,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  let vlanList: VLAN[] = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);

  useEffect(() => {
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!vlansLoaded) {
    return <Spinner />;
  }

  if (vlans) {
    vlanList = vlans;
  } else if (vlanList && fabric) {
    vlanList = vlanList.filter((vlan) => vlan.fabric === fabric);
  }

  const vlanOptions = vlanList.map((vlan) => ({
    label: getVLANDisplay(vlan),
    value: vlan.id.toString(),
  }));

  if (defaultOption) {
    vlanOptions.unshift(defaultOption);
  }

  return (
    <DynamicSelect label="VLAN" name={name} options={vlanOptions} {...props} />
  );
};

export default VLANSelect;
