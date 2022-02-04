import { Row, Col } from "@canonical/react-components";

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
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-addresses">
                Subnet addresses
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-addresses">
                {statistics.total_addresses}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-availability">
                Availability
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-availability">
                {statistics.num_available} ({statistics.available_string})
              </p>
            </Col>
          </Row>
        </Col>
        <Col size={6}>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-used">
                Used
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-used">{statistics.usage_string}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </TitledSection>
  );
};

export default SubnetUtilisation;
