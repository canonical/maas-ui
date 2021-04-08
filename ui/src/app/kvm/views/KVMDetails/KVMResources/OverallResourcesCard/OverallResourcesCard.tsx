import { Col, Row } from "@canonical/react-components";

import OverallCores from "./OverallCores";
import OverallRam from "./OverallRam";

import type { PodResources } from "app/store/pod/types";

type Props = { resources: PodResources };

const OverallResourcesCard = ({ resources }: Props): JSX.Element => {
  return (
    <Row>
      <Col size="9">
        <div className="overall-resources-card">
          <div className="overall-resources-card__ram">
            <OverallRam memory={resources.memory} />
          </div>
          <div className="overall-resources-card__cores">
            <OverallCores cores={resources.cores} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OverallResourcesCard;
