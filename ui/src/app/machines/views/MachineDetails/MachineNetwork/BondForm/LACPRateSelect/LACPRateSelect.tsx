import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as generalActions } from "app/store/general";
import { bondOptions as bondOptionsSelectors } from "app/store/general/selectors";

type Props = {
  defaultOption?: Option | null;
} & FormikFieldProps;

type Option = { label: string; value: string };

export const LACPRateSelect = ({
  defaultOption = { label: "Select LACP rate", value: "" },
  name,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const lacpRates = useSelector(bondOptionsSelectors.lacpRates);
  const loaded = useSelector(bondOptionsSelectors.loaded);
  const options: Option[] =
    lacpRates?.map((rate) => ({
      label: rate,
      value: rate,
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
    <DynamicSelect label="LACP rate" name={name} options={options} {...props} />
  );
};

export default LACPRateSelect;
