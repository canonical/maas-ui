import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { VlanVid } from "app/store/vlan/types";
import type { VLAN } from "app/store/vlan/types";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  defaultOption?: { label: string; value: string } | null;
  fabric?: VLAN["fabric"];
  includeDefaultVlan?: boolean;
  showSpinnerOnLoad?: boolean;
  setDefaultValueFromFabric?: boolean;
  vlans?: VLAN[] | null;
} & FormikFieldProps;

export const VLANSelect = ({
  defaultOption = { label: "Select VLAN", value: "" },
  fabric,
  includeDefaultVlan = true,
  showSpinnerOnLoad = false,
  setDefaultValueFromFabric,
  name,
  vlans,
  disabled,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  let vlanList: VLAN[] = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const selectedFabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, fabric)
  );
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (setDefaultValueFromFabric) {
      const vlan = selectedFabric?.default_vlan_id;
      if (vlan) {
        setFieldValue("vlan", vlan);
      }
    }
  }, [setDefaultValueFromFabric, setFieldValue, selectedFabric]);

  useEffect(() => {
    if (!vlansLoaded) dispatch(vlanActions.fetch());
  }, [vlansLoaded, dispatch]);

  if (showSpinnerOnLoad && !vlansLoaded) {
    return <Spinner />;
  }

  if (vlans) {
    vlanList = vlans;
  } else if (vlanList && (fabric || fabric === 0)) {
    vlanList = vlanList.filter((vlan) => vlan.fabric === fabric);
  }
  if (!includeDefaultVlan) {
    vlanList = vlanList.filter(({ vid }) => vid !== VlanVid.UNTAGGED);
  }

  const vlanOptions = vlanList.map((vlan) => ({
    label: getVLANDisplay(vlan) || "",
    value: vlan.id.toString(),
  }));

  if (defaultOption) {
    vlanOptions.unshift(defaultOption);
  }

  return (
    <DynamicSelect
      label="VLAN"
      name={name}
      options={vlanOptions}
      disabled={!vlansLoaded || disabled}
      {...props}
    />
  );
};

export default VLANSelect;
