import { useState } from "react";

import { Button, Row, Col } from "@canonical/react-components";
import { useParams } from "react-router";

import ZoneDetailsContent from "./ZoneDetailsContent";
import ZoneDetailsForm from "./ZoneDetailsForm";
import ZoneDetailsHeader from "./ZoneDetailsHeader";

import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";

const ZoneDetails = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams<RouteParams>();
  const zoneID = parseInt(id);

  let content: JSX.Element = (
    <Row>
      <Col size="6">
        <ZoneDetailsContent id={zoneID} />
      </Col>
      <Col size="6" className="u-align--right">
        <Button onClick={() => setShowForm(true)}>Edit</Button>
      </Col>
    </Row>
  );

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
