import { useEffect, useState } from "react";

import {
  CheckboxInput,
  Col,
  ContextualMenu,
  Row,
} from "@canonical/react-components";

import GroupSelect from "./GroupSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import { columns } from "app/machines/constants";

type Props = {
  filter: string;
  grouping: string;
  setFilter: (filter: string) => void;
  setGrouping: (group: string) => void;
  setHiddenGroups: (groups: string[]) => void;
  hiddenColumns: string[];
  toggleHiddenColumn: (column: string) => void;
};

const MachineListControls = ({
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
  hiddenColumns,
  toggleHiddenColumn,
}: Props): JSX.Element => {
  const [searchText, setSearchText] = useState(filter);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  return (
    <>
      <Row>
        <Col size={2}>
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
        <Col size={2}>
          <GroupSelect
            grouping={grouping}
            setGrouping={setGrouping}
            setHiddenGroups={setHiddenGroups}
          />
        </Col>
        <Col size={2}>
          <ContextualMenu
            className="filter-accordion"
            constrainPanelWidth
            hasToggleIcon
            position="left"
            toggleClassName="filter-accordion__toggle"
            toggleLabel={`Hidden columns ${
              hiddenColumns.length > 0 ? `(${hiddenColumns.length})` : ""
            }`}
          >
            <form
              className="machines-list-hidden-columns"
              aria-label="hidden columns"
            >
              {columns.map((column) => (
                <CheckboxInput
                  key={column}
                  disabled={column === "fqdn"}
                  label={column}
                  checked={hiddenColumns.includes(column)}
                  onChange={() => toggleHiddenColumn(column)}
                />
              ))}
            </form>
          </ContextualMenu>
        </Col>
      </Row>
    </>
  );
};

export default MachineListControls;
