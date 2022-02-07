import { Row, Col } from "@canonical/react-components";

import Definition from "app/base/components/Definition";
import TitledSection from "app/base/components/TitledSection";
import type { SubnetStatistics } from "app/store/subnet/types";

type Props = {
  statistics: SubnetStatistics;
};

const SubnetUtilisation = ({ statistics }: Props): JSX.Element => {
  return (
    <TitledSection title="Utilisation">
      <Row>
        <Col size={6}>
          <Definition
            label="Subnet addresses"
            description={`${statistics.total_addresses}`}
          />
          <Definition
            label="Availability"
            description={`${statistics.num_available} (${statistics.available_string})`}
          />
        </Col>
        <Col size={6}>
          <Definition label="Used" description={statistics.usage_string} />
        </Col>
      </Row>
    </TitledSection>
  );
};

export default SubnetUtilisation;
