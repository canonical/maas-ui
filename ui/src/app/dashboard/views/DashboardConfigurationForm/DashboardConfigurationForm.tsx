import { Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { RootState } from "app/store/root/types";

const DashboardConfigurationForm = (): JSX.Element => {
  useWindowTitle("Dashboard");

  const discoveries = useSelector((state: RootState) => state.discovery.items);

  console.log("discoveries", discoveries);

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <Row>
        <Col size={6}>Form</Col>
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
