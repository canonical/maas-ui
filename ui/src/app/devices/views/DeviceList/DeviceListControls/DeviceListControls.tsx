import { useEffect, useState } from "react";

import { Col, Row, SearchBox } from "@canonical/react-components";

import DeviceFilterAccordion from "./DeviceFilterAccordion";

type Props = {
  filter: string;
  setFilter: (filter: string) => void;
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
        {/*
          TODO: Build device search box.
          https://github.com/canonical-web-and-design/app-tribe/issues/529
        */}
        <SearchBox
          externallyControlled
          onChange={() => null}
          value={searchText}
        />
      </Col>
    </Row>
  );
};

export default DeviceListControls;
