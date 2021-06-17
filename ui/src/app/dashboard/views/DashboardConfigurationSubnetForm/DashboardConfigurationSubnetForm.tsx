import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as actionsFabric } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as actionsSubnets } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";

const DashboardConfigurationSubnetForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const subnets = useSelector(subnetSelectors.all);
  const fabrics = useSelector(fabricSelectors.all);

  const loaded = useSelector(subnetSelectors.loaded);
  const loading = useSelector(subnetSelectors.loading);
  const saved = useSelector(subnetSelectors.saved);
  const saving = useSelector(subnetSelectors.saving);

  const values = {};
  subnets.forEach((subnet) => (values[subnet.id] = subnet.active_discovery));

  useEffect(() => {
    dispatch(actionsSubnets.fetch());
    dispatch(actionsFabric.fetch());
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
          {subnets.map((subnet) => {
            const targetFabric = fabrics.find((fabric) => {
              return fabric.vlan_ids.includes(subnet.vlan);
            });
            return (
              <FormikField
                type="checkbox"
                label={[
                  <a href={`/MAAS/l/subnet/${subnet.id}`}>{subnet.cidr}</a>,
                  ` on `,
                  <a href={`/MAAS/l/fabric/${targetFabric.id}`}>
                    {targetFabric.name}
                  </a>,
                ]}
                name={String(subnet.id)}
                key={subnet.cidr}
              />
            );
          })}
        </FormikForm>
      )}
    </>
  );
};

export default DashboardConfigurationSubnetForm;
