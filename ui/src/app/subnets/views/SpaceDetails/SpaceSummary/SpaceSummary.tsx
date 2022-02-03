import { useState } from "react";

import { Button, Col, Row } from "@canonical/react-components";

import SpaceSummaryForm from "./SpaceSummaryForm";

import Definition from "app/base/components/Definition";
import TitledSection from "app/base/components/TitledSection";
import type { Space } from "app/store/space/types";

const SpaceSummary = ({ space }: { space: Space }): JSX.Element => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <TitledSection
      title="Space summary"
      buttons={
        <Col size={6} className="u-align--right">
          <Button disabled={isEdit} onClick={() => setIsEdit(true)}>
            Edit
          </Button>
        </Col>
      }
    >
      <Row>
        <Col size={6}>
          {isEdit ? (
            <SpaceSummaryForm
              space={space}
              handleDismiss={() => setIsEdit(false)}
            />
          ) : (
            <>
              <Definition label="Name">{space.name}</Definition>
              <Definition label="Description">{space.description}</Definition>
            </>
          )}
        </Col>
      </Row>
    </TitledSection>
  );
};

export default SpaceSummary;
