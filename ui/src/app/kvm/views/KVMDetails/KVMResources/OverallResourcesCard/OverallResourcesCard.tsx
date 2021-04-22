import { Col, Row, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import OverallCores from "./OverallCores";
import OverallRam from "./OverallRam";

import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const OverallResourcesCard = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (!pod) {
    return <Spinner />;
  }
  return (
    <Row>
      <Col size="9">
        <div className="overall-resources-card">
          <div className="overall-resources-card__ram">
            <OverallRam
              memory={pod.resources.memory}
              overCommit={pod.memory_over_commit_ratio}
            />
          </div>
          <div className="overall-resources-card__cores">
            <OverallCores
              cores={pod.resources.cores}
              overCommit={pod.cpu_over_commit_ratio}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OverallResourcesCard;
