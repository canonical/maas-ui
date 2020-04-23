import { Col, Row, SearchBox } from "@canonical/react-components";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "app/base/hooks";
import { filtersToQueryString, getCurrentFilters } from "app/machines/search";
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
  const { history } = useRouter();
  const intervalRef = useRef(null);

  const [searchText, setSearchText] = useState(filter);
  const [debouncing, setDebouncing] = useState(false);

  // Handle setting the URL and filter in state whenever search text changes.
  // Filtering function is debounced to prevent excessive repaints.
  useEffect(() => {
    if (debouncing) {
      intervalRef.current = setTimeout(() => {
        setFilter(searchText);
        const filters = getCurrentFilters(searchText);
        history.push({ search: filtersToQueryString(filters) });
        setDebouncing(false);
      }, DEBOUNCE_INTERVAL);
    } else {
      setFilter(searchText);
    }
    return () => clearTimeout(intervalRef.current);
  }, [debouncing, history, searchText, setFilter]);

  return (
    <Row>
      <Col size={3}>
        <FilterAccordion
          searchText={searchText}
          setSearchText={(searchText) => setSearchText(searchText)}
        />
      </Col>
      <Col size={6} style={{ position: "relative" }}>
        <SearchBox
          externallyControlled
          onChange={(searchText) => {
            setDebouncing(true);
            setSearchText(searchText);
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
