import { useEffect, useState } from "react";

import { Button, Row, Col } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";

import ZoneDetailsContent from "./ZoneDetailsContent";
import ZoneDetailsForm from "./ZoneDetailsForm";
import ZoneDetailsHeader from "./ZoneDetailsHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

const ZoneDetails = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams<RouteParams>();
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, Number(id))
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);
  const zoneID = Number(id);

  let content: JSX.Element | null = null;

  useWindowTitle(zone?.name ?? "Zone not found");

  if (zonesLoaded && zone) {
    content = (
      <Row>
        <Col size="6">
          <ZoneDetailsContent id={zoneID} />
        </Col>
        <Col size="6" className="u-align--right">
          <Button onClick={() => setShowForm(true)}>Edit</Button>
        </Col>
      </Row>
    );
  }

  if (showForm) {
    content = (
      <ZoneDetailsForm
        id={zoneID}
        closeForm={() => {
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <Section
      header={<ZoneDetailsHeader id={zoneID} />}
      headerClassName="u-no-padding--bottom"
    >
      {content}
    </Section>
  );
};

export default ZoneDetails;
