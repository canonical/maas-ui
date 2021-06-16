import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions } from "app/store/discovery";
import { actions as actionsSubnets } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";

const DashboardConfigurationSubnetForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const subnets = useSelector(subnetSelectors.all);

  const loaded = useSelector(subnetSelectors.loaded);
  const loading = useSelector(subnetSelectors.loading);
  const saved = useSelector(subnetSelectors.saved);
  const saving = useSelector(subnetSelectors.saving);

  const values = {};
  subnets.forEach((subnet) => (values[subnet.id] = subnet.active_discovery));

  useEffect(() => {
    dispatch(actions.fetch());
    dispatch(actionsSubnets.fetch());
  }, [dispatch]);

  if (!loaded) return <Spinner />;

  return (
    <>
      {loading && <Spinner text="Loading..." />}
      {loaded && (
        <FormikForm
          buttonsAlign="left"
          buttonsBordered={false}
          onSubmit={(values, { resetForm }) => {
            subnets.forEach((subnet) => {
              if (subnet.active_discovery !== values[subnet.id]) {
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
          saving={saving}
          saved={saved}
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
      )}
    </>
  );
};

export default DashboardConfigurationSubnetForm;
