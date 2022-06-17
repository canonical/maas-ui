import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";

import DeviceFilterAccordion from "./DeviceFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { SetSearchFilter } from "app/base/types";

type Props = {
  filter: string;
  setFilter: SetSearchFilter;
};

const DeviceListControls = ({ filter, setFilter }: Props): JSX.Element => {
  const [searchText, setSearchText] = useState(filter);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  return (
    <Row>
      <Col size={3}>
        <DeviceFilterAccordion
          searchText={searchText}
          setSearchText={setFilter}
        />
      </Col>
      <Col size={9}>
        <DebounceSearchBox
          onDebounced={(debouncedText) => setFilter(debouncedText)}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Col>
    </Row>
  );
};

export default DeviceListControls;
