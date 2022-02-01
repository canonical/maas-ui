import { useState } from "react";

import { Strip, Button, Row, Col } from "@canonical/react-components";

import SpaceSummaryForm from "./SpaceSummaryForm";

import Definition from "app/base/components/Definition";
import { useId } from "app/base/hooks/base";
import type { Space } from "app/store/space/types";

const SpaceSummary = ({
  name,
  description,
}: Pick<Space, "name" | "description">): JSX.Element => {
  const id = useId();
  const [isEdit, setIsEdit] = useState(false);
  return (
    <Strip shallow element="section" aria-labelledby={id}>
      <Row>
        <Col size={6}>
          <h2 id={id} className="p-heading--4">
            Space summary
          </h2>
        </Col>
        <Col size={6} className="u-align--right">
          <Button disabled={isEdit} onClick={() => setIsEdit(true)}>
            Edit
          </Button>
        </Col>
      </Row>
      <Row>
        <Col size={6}>
          {isEdit ? (
            <SpaceSummaryForm handleDismiss={() => setIsEdit(false)} />
          ) : (
            <>
              <Definition label="Name">{name}</Definition>
              <Definition label="Description">{description}</Definition>
            </>
          )}
        </Col>
      </Row>
    </Strip>
  );
};

export default SpaceSummary;
