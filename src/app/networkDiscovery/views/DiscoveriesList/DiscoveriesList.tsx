import { useState } from "react";

import { Col, Row } from "@canonical/react-components";

import DiscoveriesFilterAccordion from "./DiscoveriesFilterAccordion";

import { useNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import SearchBox from "@/app/base/components/SearchBox";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import DiscoveriesTable from "@/app/networkDiscovery/components/DiscoveriesTable/DiscoveriesTable";
import { discoveryActions } from "@/app/store/discovery";
import { FilterDiscoveries } from "@/app/store/discovery/utils";

export enum Labels {
  DiscoveriesList = "Discoveries list",
  Loading = "Loading...",
  NoNewDiscoveries = "No new discoveries.",
  AddDiscovery = "Add discovery...",
  DeleteDiscovery = "Delete discovery...",
}

const DiscoveriesList = (): React.ReactElement => {
  const [searchString, setSearchString] = useState("");
  const { data, isLoading, isSuccess } = useNetworkDiscoveries();
  const allDiscoveries = data?.items ?? [];

  const discoveries = FilterDiscoveries.filterItems(
    allDiscoveries,
    searchString ?? ""
  );

  const loading = isLoading;
  const loaded = isSuccess;

  useWindowTitle("Network Discovery");

  useFetchActions([discoveryActions.fetch]);

  if (loaded && !searchString && discoveries.length === 0) {
    return <div data-testid="no-discoveries">No new discoveries.</div>;
  }

  return (
    <div aria-label={Labels.DiscoveriesList}>
      <Row>
        <Col size={3}>
          <DiscoveriesFilterAccordion
            searchText={searchString}
            setSearchText={setSearchString}
          />
        </Col>
        <Col size={9}>
          <SearchBox
            data-testid="discoveries-search"
            externallyControlled
            onChange={setSearchString}
            value={searchString}
          />
        </Col>
      </Row>
      <DiscoveriesTable
        discoveries={discoveries}
        filtering={!!searchString}
        loading={loading}
      />
    </div>
  );
};

export default DiscoveriesList;
