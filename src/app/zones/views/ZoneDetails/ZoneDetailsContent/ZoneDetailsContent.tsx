import { useEffect } from "react";

import { Row, Col } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import Definition from "app/base/components/Definition";
import type { RootState } from "app/store/root/types";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: number;
};

const ZoneDetailsContent = ({ id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, id)
  );

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

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
