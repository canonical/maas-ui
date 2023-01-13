import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";

import GroupSelect from "./GroupSelect";
import HiddenColumnsSelect from "./HiddenColumnsSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { FetchGroupKey } from "app/store/machine/types";

export type MachineListControlsProps = {
  filter: string;
  grouping: FetchGroupKey | null;
  setFilter: (filter: string) => void;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  hiddenColumns: string[];
  setHiddenColumns: React.Dispatch<React.SetStateAction<string[]>>;
};

const MachineListControls = ({
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
  hiddenColumns,
  setHiddenColumns,
}: MachineListControlsProps): JSX.Element => {
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
      <Col size={4}>
        <DebounceSearchBox
          onDebounced={(debouncedText) => setFilter(debouncedText)}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Col>
      <Col size={3}>
        <div className="u-flex--align-baseline">
          <div className="u-flex--grow">
            <GroupSelect
              grouping={grouping}
              setGrouping={setGrouping}
              setHiddenGroups={setHiddenGroups}
            />
          </div>
        </div>
      </Col>
      <Col size={2}>
        <HiddenColumnsSelect
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      </Col>
    </Row>
  );
};

export default MachineListControls;
