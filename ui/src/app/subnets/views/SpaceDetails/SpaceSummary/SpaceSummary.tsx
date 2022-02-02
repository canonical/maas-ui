import { useState } from "react";

import { Button, Col } from "@canonical/react-components";

import SpaceSummaryForm from "./SpaceSummaryForm";

import Definition from "app/base/components/Definition";
import TitledSection from "app/base/components/TitledSection";
import type { Space } from "app/store/space/types";

const SpaceSummary = ({
  name,
  description,
}: Pick<Space, "name" | "description">): JSX.Element => {
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
      {isEdit ? (
        <SpaceSummaryForm handleDismiss={() => setIsEdit(false)} />
      ) : (
        <>
          <Definition label="Name">{name}</Definition>
          <Definition label="Description">{description}</Definition>
        </>
      )}
    </TitledSection>
  );
};

export default SpaceSummary;
