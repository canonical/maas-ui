import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import configSelectors from "app/store/config/selectors";
import { NetworkDiscovery } from "app/store/config/types";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import subnetsURLS from "app/subnets/urls";
import { simpleSortByKey } from "app/utils";

type SubnetDiscoveryValues = {
  [x: number]: Subnet["active_discovery"];
};

const DashboardConfigurationSubnetForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const subnets = useSelector(subnetSelectors.all);
  const fabrics = useSelector(fabricSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const fabricsLoaded = useSelector(subnetSelectors.loaded);
  const saved = useSelector(subnetSelectors.saved);
  const saving = useSelector(subnetSelectors.saving);
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const discoveryDisabled = networkDiscovery === NetworkDiscovery.DISABLED;

  useEffect(() => {
    dispatch(subnetActions.fetch());
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  const loaded = subnetsLoaded && fabricsLoaded;
  let content: JSX.Element = <Spinner text="Loading..." />;

  if (loaded) {
    const sortedSubnets = [...subnets].sort(simpleSortByKey("cidr"));
    const initialValues: SubnetDiscoveryValues = {};
    sortedSubnets.forEach((subnet) => {
      initialValues[subnet.id] = subnet.active_discovery;
    });

    content = (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          subnets.forEach((subnet) => {
            if (subnet.active_discovery !== values[subnet.id]) {
              dispatch(
                subnetActions.update({
                  active_discovery: values[subnet.id],
                  id: subnet.id,
                })
              );
            }
          });
          resetForm({ values });
        }}
      >
        <FormikFormContent<SubnetDiscoveryValues>
          buttonsAlign="left"
          buttonsBordered={false}
          saving={saving}
          saved={saved}
          submitDisabled={discoveryDisabled}
        >
          <ul className="p-list is-split">
            {sortedSubnets.map((subnet) => {
              const targetFabric = fabrics.find((fabric) =>
                fabric.vlan_ids.includes(subnet.vlan)
              );
              return (
                <li className="p-list__item" key={`subnet-${subnet.id}`}>
                  <FormikField
                    disabled={discoveryDisabled}
                    label={
                      <>
                        <Link
                          data-testid="subnet-link"
                          to={subnetsURLS.subnet.index({ id: subnet.id })}
                        >
                          {subnet.cidr}
                        </Link>
                        {targetFabric && (
                          <>
                            <span> on </span>
                            <Link
                              data-testid="fabric-link"
                              to={subnetsURLS.fabric.index({
                                id: targetFabric.id,
                              })}
                            >
                              {targetFabric.name}
                            </Link>
                          </>
                        )}
                      </>
                    }
                    name={`${subnet.id}`}
                    type="checkbox"
                  />
                </li>
              );
            })}
          </ul>
        </FormikFormContent>
      </Formik>
    );
  }

  return (
    <Strip shallow>
      <h3 className="p-heading--4">Subnet mapping</h3>
      <p>
        Active discovery (subnet mapping) can be enabled below on the configured
        subnets. Each rack will scan the subnets that allow it. This helps
        ensure discovery information is accurate and complete.
      </p>
      {content}
    </Strip>
  );
};

export default DashboardConfigurationSubnetForm;
