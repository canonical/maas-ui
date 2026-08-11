import { Card, Col, Row } from "@canonical/react-components";

import "./_index.scss";
import { useGetSwitch } from "@/app/api/query/switches";

type Props = {
  id: number;
};

const SwitchDetailsSummary = ({ id }: Props) => {
  const { data: details } = useGetSwitch({ path: { switch_id: id } });

  return (
    <Row>
      <Col size={3}>
        <Card className="switch-details-summary__card">
          <strong className="p-muted-heading u-no-padding--top">Image</strong>
          <h4 className="u-no-margin--bottom">{details?.target_image}</h4>
        </Card>
      </Col>
      <Col size={3}>
        <Card className="switch-details-summary__card">
          <strong className="p-muted-heading u-no-padding--top">
            Mac Address
          </strong>
          <h4 className="u-no-margin--bottom">{details?.management_mac}</h4>
        </Card>
      </Col>
    </Row>
  );
};

export default SwitchDetailsSummary;
