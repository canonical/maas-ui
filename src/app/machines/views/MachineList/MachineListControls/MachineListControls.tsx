import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";

import GroupSelect from "./GroupSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { FetchGroupKey } from "app/store/machine/types";

type Props = {
  filter: string;
  grouping: FetchGroupKey | null;
  setFilter: (filter: string) => void;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  hiddenColumns?: string[];
  toggleHiddenColumn?: (column: string) => void;
};

const MachineListControls = ({
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
}: Props): JSX.Element => {
  const [searchText, setSearchText] = useState(filter);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  return (
    <Row className="machine-list-controls">
      <Col size={3}>
        <MachinesFilterAccordion
          searchText={searchText}
          setSearchText={(searchText) => {
            setFilter(searchText);
          }}
        />
      </Col>
      <Col size={6}>
        <DebounceSearchBox
          onDebounced={(debouncedText) => setFilter(debouncedText)}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Col>
      <Col size={3}>
        <GroupSelect
          grouping={grouping}
          setGrouping={setGrouping}
          setHiddenGroups={setHiddenGroups}
        />
      </Col>
    </Row>
  );
};

export default MachineListControls;
