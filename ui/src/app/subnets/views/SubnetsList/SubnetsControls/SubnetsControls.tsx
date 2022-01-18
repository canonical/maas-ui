import { useState } from "react";

import { Row, Col, Button, Select } from "@canonical/react-components";

import type {
  GroupByKey,
  SubnetGroupByProps,
} from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsControls = ({
  groupBy,
  setGroupBy,
}: SubnetGroupByProps): JSX.Element => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <Row>
      <Col size={3}>
        <Select
          aria-label="Group by"
          label={
            <>
              Group by{" "}
              <Button
                aria-label="more about group by"
                appearance="base"
                dense
                hasIcon
                onClick={() => setIsInfoOpen(!isInfoOpen)}
              >
                <i className="p-icon--question"></i>
              </Button>
            </>
          }
          name="groupBy"
          value={groupBy}
          onChange={(event) => {
            setGroupBy(event.target.value as GroupByKey);
          }}
          options={[
            {
              label: "Fabric",
              value: "fabric",
            },
            {
              label: "Space",
              value: "space",
            },
          ]}
        />
        {isInfoOpen ? (
          <div data-testId="subnets-groupby-help-text">
            <p className="p-form-help-text">
              <strong>Fabric</strong> is a set of consistent interconnected
              VLANs that are capable of mutual communication.
            </p>
            <p className="p-form-help-text">
              <strong>Space</strong> is a grouping of networks (VLANs and their
              subnets) that are able to mutually communicate with each other.
            </p>
            <p className="p-form-help-text">
              Subnets within a space do not need to belong to the same fabric.
            </p>
          </div>
        ) : null}
      </Col>
    </Row>
  );
};

export default SubnetsControls;
