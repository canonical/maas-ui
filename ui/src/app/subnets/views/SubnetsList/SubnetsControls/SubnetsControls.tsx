import { useState } from "react";

import { Row, Col, Button, Icon, Select } from "@canonical/react-components";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import { SubnetsColumns } from "app/subnets/views/SubnetsList/SubnetsTable/constants";
import type {
  GroupByKey,
  SubnetGroupByProps,
} from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsControls = ({
  groupBy,
  setGroupBy,
  handleSearch,
}: SubnetGroupByProps & {
  handleSearch: (text: string) => void;
}): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <Row>
      <Col size={9}>
        <DebounceSearchBox
          searchText={searchText}
          onDebounced={handleSearch}
          setSearchText={setSearchText}
        />
      </Col>
      <Col size={3}>
        <Row className="subnets-controls-group-by">
          <Select
            stacked
            aria-label="Group by"
            name="groupBy"
            value={groupBy}
            onChange={(event) => {
              setGroupBy(event.target.value as GroupByKey);
            }}
            options={[
              {
                label: "Group by fabric",
                value: SubnetsColumns.FABRIC,
              },
              {
                label: "Group by space",
                value: SubnetsColumns.SPACE,
              },
            ]}
          />
          <Button
            aria-label="more about group by"
            appearance="base"
            dense
            hasIcon
            onClick={() => setIsInfoOpen(!isInfoOpen)}
          >
            <Icon name="help" />
          </Button>
        </Row>
        <Row>
          {isInfoOpen ? (
            <div
              className="u-nudge-down--x-small"
              data-testId="subnets-groupby-help-text"
            >
              <p className="p-form-help-text">
                <strong>Fabric</strong> is a set of consistent interconnected
                VLANs that are capable of mutual communication.
              </p>
              <p className="p-form-help-text">
                <strong>Space</strong> is a grouping of networks (VLANs and
                their subnets) that are able to mutually communicate with each
                other.
              </p>
              <p className="p-form-help-text">
                Subnets within a space do not need to belong to the same fabric.
              </p>
            </div>
          ) : null}
        </Row>
      </Col>
    </Row>
  );
};

export default SubnetsControls;
