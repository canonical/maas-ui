import { useState } from "react";

import { Row, Col } from "@canonical/react-components";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { SubnetGroupByProps } from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SubnetsControls = ({
  searchText: initialSearchText = "",
  handleSearch,
}: Pick<SubnetGroupByProps, "groupBy"> & {
  searchText?: string;
  handleSearch: (text: string) => void;
}): JSX.Element => {
  const [searchText, setSearchText] = useState(initialSearchText);

  return (
    <Row>
      <Col size={12}>
        <DebounceSearchBox
          onDebounced={handleSearch}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Col>
    </Row>
  );
};

export default SubnetsControls;
