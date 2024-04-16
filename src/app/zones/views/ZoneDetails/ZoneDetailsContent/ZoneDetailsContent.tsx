import { Row, Col } from "@canonical/react-components";
import { useSelector } from "react-redux";

import Definition from "@/app/base/components/Definition";
import { useFetchActions } from "@/app/base/hooks";
import type { RootState } from "@/app/store/root/types";
import { zoneActions } from "@/app/store/zone";
import zoneSelectors from "@/app/store/zone/selectors";

type Props = {
  id: number;
};

const ZoneDetailsContent = ({ id }: Props): JSX.Element | null => {
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, id)
  );

  useFetchActions([zoneActions.fetch]);

  if (zone) {
    return (
      <Row>
        <Col size={6}>
          <Definition label="Name">{zone.name}</Definition>
          <Definition label="Description">{zone.description}</Definition>
          <Definition label="Machines">{`${zone.machines_count}`}</Definition>
        </Col>
      </Row>
    );
  }
  return null;
};

export default ZoneDetailsContent;
