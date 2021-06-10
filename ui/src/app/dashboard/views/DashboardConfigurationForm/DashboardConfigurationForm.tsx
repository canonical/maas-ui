import { useEffect } from "react";

import { Col, Row } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
// import * as Yup from "yup";

import DiscoveriesListHeader from "../DiscoveriesListHeader";

// import FormikField from "app/base/components/FormikField";
// import FormikForm from "app/base/components/FormikForm";
import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import { actions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";
// import { fabric } from "testing/factories";

// const options = [
//   { label: "Hello", value: "world" },
//   { label: "Hello2", value: "world2" },
// ];

// const createYupSchema = (discoveries) => {
//   const schema = discoveries.reduce(
//     (schema, discovery) => {
//       return { ...schema, [discovery.discovery_id]: Yup.boolean() };
//     },
//     { discovery_enabled: Yup.boolean(), discovery_interval: Yup.string() }
//   );
// };

// const constructLabel = (discovery) => (
//   <div key={discovery.id}>
//     <div>
//       <a href={`/MAAS/l/subnet/${discovery.subnet}`}>{discovery.subnet_cidr}</a>
//       on
//       <a href={`/MAAS/l/fabric/${discovery.fabric}`}>{discovery.fabric_name}</a>
//     </div>
//   </div>
// );

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle("Dashboard");

  const discoveries = useSelector(discoverySelectors.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  console.log("discoveries", discoveries);

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <Row>
        <Col size={6}>
          {/* <FormikForm
            onSubmit={() => {
              return;
            }}
            initialValues={{ "discovery-enabled": false }}
            buttonsAlign="right"
          >
            <FormikField
              label="Discovery enabled"
              name="discovery-enabled"
              type="checkbox"
              wrapperClassName="u-sv3"
            />
            <FormikField
              label="Active discovery interval"
              name="discovery-interval-selector"
              component={Select}
              options={options}
            /> */}
          <NetworkDiscoveryForm />
          {/* <div>
            {discoveries
              ? discoveries.map((discovery) => (
                  <FormikField
                    label={constructLabel(discovery)}
                    name={discovery.discovery_id}
                    type="checkbox"
                  />
                ))
              : null}
          </div> */}
          {/* </FormikForm> */}
        </Col>
        <Col size={6}>
          <p>
            <small>
              When discovery is enabled, MAAS will use passive techniques (such
              as listening to ARP requests and mDNS advertisements) to observe
              networks attached to rack controllers. Active discovery (subnet
              mapping) can be enabled below on the configured subnets. Each rack
              will scan the subnets that allow it. This helps ensure discovery
              information is accurate and complete.
            </small>
          </p>
          <p>
            <a
              className="p-link--external p-text--small"
              href="https://maas.io/docs/network-discovery"
            >
              About network discovery
            </a>
          </p>
        </Col>
      </Row>
    </Section>
  );
};

export default DashboardConfigurationForm;
