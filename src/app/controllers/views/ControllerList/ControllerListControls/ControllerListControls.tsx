import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { SetSearchFilter } from "app/base/types";

type Props = {
  filter: string;
  setFilter: SetSearchFilter;
};

const ControllerListControls = ({ filter, setFilter }: Props): JSX.Element => {
  const [searchText, setSearchText] = useState(filter);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  return (
    <Row>
      <Col size={12}>
        <DebounceSearchBox
          searchText={searchText}
          onDebounced={(debouncedText) => setFilter(debouncedText)}
          setSearchText={setSearchText}
        />
      </Col>
    </Row>
  );
};

export default ControllerListControls;
