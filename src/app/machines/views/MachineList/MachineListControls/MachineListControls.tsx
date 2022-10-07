import { useEffect, useState } from "react";

import { Col, ContextualMenu, Row } from "@canonical/react-components";

import { DEFAULTS } from "../MachineListTable/constants";

import GroupSelect from "./GroupSelect";
import HiddenColumnsSelect from "./HiddenColumnsSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { FetchGroupKey } from "app/store/machine/types";

type Props = {
  filter: string;
  grouping: FetchGroupKey | null;
  setFilter: (filter: string) => void;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  hiddenColumns: string[];
  toggleHiddenColumn: (column: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
};

const MachineListControls = ({
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
  itemsPerPage,
  setItemsPerPage,
  hiddenColumns,
  toggleHiddenColumn,
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
      <Col size={4}>
        <DebounceSearchBox
          onDebounced={(debouncedText) => setFilter(debouncedText)}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Col>
      <Col size={2}>
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
      <Col size={1}>
        {/* TODO: replace chavron with <Icon name="settings" />  */}
        <ContextualMenu
          hasToggleIcon
          links={[
            "Items per page",
            ...[5, 10, 25, DEFAULTS.pageSize, 100].map((option) => ({
              className: itemsPerPage === option ? "is-active" : undefined,
              children: option,
              onClick: () => setItemsPerPage(option),
            })),
          ]}
          toggleClassName="u-no-margin--bottom"
          toggleLabel="Options"
        />
      </Col>
      <Col size={2}>
        <HiddenColumnsSelect
          hiddenColumns={hiddenColumns}
          toggleHiddenColumn={toggleHiddenColumn}
        />
      </Col>
    </Row>
  );
};

export default MachineListControls;
