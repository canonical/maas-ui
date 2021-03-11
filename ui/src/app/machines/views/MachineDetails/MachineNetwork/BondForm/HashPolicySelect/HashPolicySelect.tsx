import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as generalActions } from "app/store/general";
import { bondOptions as bondOptionsSelectors } from "app/store/general/selectors";
import { BondMode, BondXmitHashPolicy } from "app/store/general/types";

type Props = {
  bondMode?: BondMode | null;
  defaultOption?: { label: string; value: string } | null;
} & FormikFieldProps;

type Option = { label: string; value: string };

const generateCaution = (
  bondMode: BondMode,
  xmitHashPolicy: BondXmitHashPolicy
) =>
  bondMode === BondMode.LINK_AGGREGATION &&
  [BondXmitHashPolicy.LAYER3_4, BondXmitHashPolicy.ENCAP3_4].includes(
    xmitHashPolicy
  )
    ? "This hash policy is not fully 802.3ad compliant."
    : null;

export const HashPolicySelect = ({
  bondMode,
  defaultOption = { label: "Select XMIT hash policy", value: "" },
  name,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const xmitHashPolicies = useSelector(bondOptionsSelectors.xmitHashPolicies);
  const loaded = useSelector(bondOptionsSelectors.loaded);
  const { values } = useFormikContext();
  const options: Option[] =
    xmitHashPolicies?.map((policy) => ({
      label: policy,
      value: policy,
    })) || [];

  if (defaultOption) {
    options.unshift(defaultOption);
  }

  useEffect(() => {
    dispatch(generalActions.fetchBondOptions());
  }, [dispatch]);

  if (!loaded) {
    return <Spinner />;
  }

  return (
    <DynamicSelect
      caution={generateCaution(bondMode, values[name])}
      label="Hash policy"
      name={name}
      options={options}
      {...props}
    />
  );
};

export default HashPolicySelect;
