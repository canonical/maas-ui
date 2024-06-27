import { Row, Col } from "@canonical/react-components";

import { useZoneById } from "@/app/api/query/zones";
import Definition from "@/app/base/components/Definition";

type Props = {
  id: number;
};

const ZoneDetailsContent = ({ id }: Props): JSX.Element | null => {
  const zone = useZoneById(id);

  if (zone.data) {
    return (
      <Row>
        <Col size={6}>
          <Definition label="Name">{zone.data.name}</Definition>
          <Definition label="Description">{zone.data.description}</Definition>
          <Definition label="Machines">{`${zone.data.machines_count}`}</Definition>
        </Col>
      </Row>
    );
  }
  return null;
};

export default ZoneDetailsContent;
