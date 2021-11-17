import { useEffect, useRef, useState } from "react";

import { Col, Row, SearchBox } from "@canonical/react-components";

import GroupSelect from "./GroupSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

type Props = {
  filter?: string;
  grouping: string;
  setFilter: (filter: string) => void;
  setGrouping: (group: string) => void;
  setHiddenGroups: (groups: string[]) => void;
};

export const DEBOUNCE_INTERVAL = 500;

const MachineListControls = ({
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
}: Props): JSX.Element => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [searchText, setSearchText] = useState(filter);
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  // Clear the timeout when the component is unmounted.
  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    },
    []
  );

  return (
    <Row>
      <Col size={3}>
        <MachinesFilterAccordion
          searchText={searchText}
          setSearchText={(searchText) => {
            setFilter(searchText);
          }}
        />
      </Col>
      <Col size={6} style={{ position: "relative" }}>
        <SearchBox
          externallyControlled
          onChange={(searchText: string) => {
            setDebouncing(true);
            setSearchText(searchText);
            // Clear the previous timeout.
            if (intervalRef.current) {
              clearTimeout(intervalRef.current);
            }
            intervalRef.current = setTimeout(() => {
              setFilter(searchText);
              setDebouncing(false);
            }, DEBOUNCE_INTERVAL);
          }}
          value={searchText}
        />
        {/* TODO Caleb 23/04/2020 - Update SearchBox to allow spinner
            https://github.com/canonical-web-and-design/react-components/issues/112 */}
        {debouncing && (
          <i
            className="p-icon--spinner u-animation--spin"
            data-testid="search-spinner"
            style={{
              position: "absolute",
              top: ".675rem",
              right: searchText ? "5rem" : "3rem",
            }}
          ></i>
        )}
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
