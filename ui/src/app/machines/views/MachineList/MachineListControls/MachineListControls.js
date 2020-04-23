import { Col, Row, SearchBox } from "@canonical/react-components";
import React from "react";

import { useRouter } from "app/base/hooks";
import { filtersToQueryString, getCurrentFilters } from "app/machines/search";
import FilterAccordion from "./FilterAccordion";
import GroupSelect from "./GroupSelect";

const MachineListControls = ({
  grouping,
  searchText,
  setGrouping,
  setHiddenGroups,
  setSearchText,
}) => {
  const { history } = useRouter();

  // Handle updating the search text state and URL.
  const changeFilters = (searchText) => {
    // Update the search text state.
    setSearchText(searchText);
    // Convert the search string into a query string and update the URL.
    const filters = getCurrentFilters(searchText);
    history.push({ search: filtersToQueryString(filters) });
  };

  return (
    <Row>
      <Col size={3}>
        <FilterAccordion
          searchText={searchText}
          setSearchText={changeFilters}
        />
      </Col>
      <Col size={6}>
        <SearchBox
          externallyControlled
          onChange={changeFilters}
          value={searchText}
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
