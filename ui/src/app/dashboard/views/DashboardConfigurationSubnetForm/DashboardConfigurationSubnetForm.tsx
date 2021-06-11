import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions } from "app/store/discovery";
// import discoveriesSelectors from "app/store/discovery/selectors";
import { actions as actionsSubnets } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";

const DashboardConfigurationSubnetForm = (): JSX.Element => {
  const dispatch = useDispatch();
  // const discoveries = useSelector(discoveriesSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  // const updateSubnets = actionsSubnets.update;

  useEffect(() => {
    dispatch(actions.fetch());
    dispatch(actionsSubnets.fetch());
  }, [dispatch]);

  console.log("subnets-->", subnets);

  const values = {};
  if (!subnetsLoaded) return <Spinner />;
  subnets.forEach((subnet) => (values[subnet.id] = subnet.active_discovery));

  return (
    <FormikForm
      onSubmit={(values, { resetForm }) => {
        subnets.forEach((subnet) => {
          if (subnet.active_discovery !== values[subnet.id]) {
            console.log("matched");
            dispatch(
              actionsSubnets.update({
                id: subnet.id,
                name: subnet.name,
                active_discovery: values[subnet.id],
                description: subnet.description,
              })
            );
          }
        });
        resetForm({ values });
      }}
      initialValues={values}
    >
      {subnets.map((subnet) => (
        <FormikField
          type="checkbox"
          label={`${subnet.cidr} on ${subnet.cidr}`}
          name={String(subnet.id)}
          key={subnet.cidr}
        />
      ))}
    </FormikForm>
  );
};

export default DashboardConfigurationSubnetForm;
