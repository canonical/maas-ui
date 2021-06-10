import { useEffect } from "react";

import { Row, Col } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "app/store/root/types";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: number;
};

const ZoneDetailsContent = ({ id }: Props): JSX.Element => {
  // const zonesLoaded = useSelector(zoneSelectors.loaded);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, Number(id))
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  if (zone) {
    return (
      <>
        <Row>
          <Col size="2">
            <p>Name:</p>
          </Col>
          <Col size="4">
            <p>{zone.name}</p>
          </Col>
        </Row>
        <Row>
          <Col size="2">
            <p>Description:</p>
          </Col>
          <Col size="4">
            <p>{zone.description}</p>
          </Col>
        </Row>
        <Row>
          <Col size="2">
            <p>Machines:</p>
          </Col>
          <Col size="4">
            <p>{zone.machines_count}</p>
          </Col>
        </Row>
      </>
    );
  }
  return null;
};

export default ZoneDetailsContent;
