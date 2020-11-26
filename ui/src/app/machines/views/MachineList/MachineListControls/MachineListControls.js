import { useEffect, useRef, useState } from "react";
import { Col, Row, SearchBox } from "@canonical/react-components";
import PropTypes from "prop-types";

import FilterAccordion from "./FilterAccordion";
import GroupSelect from "./GroupSelect";

export const DEBOUNCE_INTERVAL = 500;

const MachineListControls = ({
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
}) => {
  const intervalRef = useRef(null);

  const [searchText, setSearchText] = useState(filter);
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  // Clear the timeout when the component is unmounted.
  useEffect(() => () => clearTimeout(intervalRef.current), []);

  return (
    <Row>
      <Col size={3}>
        <FilterAccordion
          searchText={searchText}
          setSearchText={(searchText) => {
            setFilter(searchText);
          }}
        />
      </Col>
      <Col size={6} style={{ position: "relative" }}>
        <SearchBox
          externallyControlled
          onChange={(searchText) => {
            setDebouncing(true);
            setSearchText(searchText);
            // Clear the previous timeout.
            clearTimeout(intervalRef.current);
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

MachineListControls.propTypes = {
  filter: PropTypes.string,
  grouping: PropTypes.string,
  setFilter: PropTypes.func,
  setGrouping: PropTypes.func,
  setHiddenGroups: PropTypes.func,
};

export default MachineListControls;
