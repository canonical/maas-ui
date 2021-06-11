import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions } from "app/store/discovery";
import discoveriesSelectors from "app/store/discovery/selectors";

const DashboardConfigurationSubnetForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const discoveries = useSelector(discoveriesSelectors.all);
  const updateDiscoveries = actions.update;

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  console.log("discoveries-->", discoveries);

  const values = {};
  discoveries.forEach(
    (discovery) => (values[discovery.discovery_id] = discovery.value)
  );

  return (
    <FormikForm
      onSubmit={(values, { resetForm }) => {
        dispatch(updateDiscoveries(values));
        resetForm({ values });
      }}
      initialValues={values}
    >
      {discoveries.map((discovery) => (
        <FormikField
          type="checkbox"
          label={`<${discovery.subnet_cidr} on ${discovery.fabric_name}`}
          name={discovery.discovery_id}
          key={discovery.discovery_id}
        />
      ))}
    </FormikForm>
  );
};

export default DashboardConfigurationSubnetForm;
