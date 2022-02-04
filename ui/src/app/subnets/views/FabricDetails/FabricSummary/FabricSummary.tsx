import { useState } from "react";

import { Button, Col, Row } from "@canonical/react-components";

import EditFabric from "../EditFabric";

import FabricController from "./FabricController";

import Definition from "app/base/components/Definition";
import TitledSection from "app/base/components/TitledSection";
import type { Fabric } from "app/store/fabric/types";

const FabricSummary = ({ fabric }: { fabric: Fabric }): JSX.Element => {
  const [editing, setEditing] = useState(false);

  return (
    <TitledSection
      title="Fabric summary"
      buttons={
        !editing && (
          <Button
            appearance="neutral"
            className="u-no-margin--bottom"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )
      }
    >
      {editing ? (
        <EditFabric close={() => setEditing(false)} id={fabric.id} />
      ) : (
        <Row>
          <Col size={6}>
            <Definition label="Name" description={fabric.name} />
            <FabricController id={fabric.id} />
          </Col>
          <Col size={6}>
            <Definition label="Description" description={fabric.description} />
          </Col>
        </Row>
      )}
    </TitledSection>
  );
};

export default FabricSummary;
