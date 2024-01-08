import { useState } from "react";

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
    <DebounceSearchBox
      onDebounced={handleSearch}
      searchText={searchText}
      setSearchText={setSearchText}
    />
  );
};

export default SubnetsControls;
