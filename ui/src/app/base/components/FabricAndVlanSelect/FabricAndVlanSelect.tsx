import { useEffect } from "react";

import { Field } from "formik";
import { useDispatch, useSelector } from "react-redux";

import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  defaultOption?: { label: string; value: string; disabled?: boolean } | null;
} & FormikFieldProps;

export const FabricAndVlanSelect = ({
  defaultOption = {
    label: "Select Fabric and VLAN",
    value: "",
    disabled: true,
  },
  label = "Fabric & VLAN",
  name,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const vlans = useSelector(vlanSelectors.all);
  const fabrics = useSelector(fabricSelectors.all) as Array<Fabric>;
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);

  useEffect(() => {
    if (!vlansLoaded) dispatch(vlanActions.fetch());
  }, [dispatch, vlansLoaded]);

  useEffect(() => {
    if (!fabricsLoaded) dispatch(fabricActions.fetch());
  }, [dispatch, fabricsLoaded]);

  return (
    <label>
      {label}
      <Field component="select" name={name}>
        {defaultOption && (
          <option value={defaultOption.value} disabled={defaultOption.disabled}>
            {defaultOption.label}
          </option>
        )}
        {fabrics.map((fabric) => (
          <optgroup key={fabric.id} label={fabric.name}>
            {fabric.vlan_ids?.map((vlan) => (
              <option key={vlan} value={vlan}>
                {getVLANDisplay(vlans.find((_vlan) => _vlan.id === vlan))}
              </option>
            ))}
          </optgroup>
        ))}
      </Field>
    </label>
  );
};

export default FabricAndVlanSelect;
