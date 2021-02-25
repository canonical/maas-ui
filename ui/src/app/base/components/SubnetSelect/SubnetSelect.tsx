import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import DynamicSelect from "app/base/components/DynamicSelect";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetDisplay } from "app/store/subnet/utils";

type Props = {
  defaultOption?: { label: string; value: string } | null;
  filterFunction?: (subnet: Subnet) => boolean;
  vlan?: Subnet["vlan"];
} & FormikFieldProps;

export const SubnetSelect = ({
  defaultOption = { label: "Select subnet", value: "" },
  name,
  vlan,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  let subnets: Subnet[] = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);

  useEffect(() => {
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  if (!subnetsLoaded) {
    return <Spinner />;
  }

  if (subnets && vlan) {
    subnets = subnets.filter((subnet) => subnet.vlan === vlan);
  }

  const subnetOptions = subnets.map((subnet) => ({
    label: getSubnetDisplay(subnet),
    value: subnet.id.toString(),
  }));

  if (defaultOption) {
    subnetOptions.unshift(defaultOption);
  }

  return (
    <DynamicSelect
      label="Subnet"
      name={name}
      options={subnetOptions}
      {...props}
    />
  );
};

export default SubnetSelect;
