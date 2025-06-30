import type { ReactElement } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import type { DiscoveryResponse } from "@/app/apiclient";
import useDiscoveriesTableColumns from "@/app/networkDiscovery/components/DiscoveriesTable/useDiscoveriesTableColumns/useDiscoveriesTableColumns";

type DiscoveriesTableProps = {
  discoveries: DiscoveryResponse[];
  loading: boolean;
  filtering: boolean;
};

const DiscoveriesTable = ({
  discoveries,
  loading,
  filtering,
}: DiscoveriesTableProps): ReactElement => {
  const columns = useDiscoveriesTableColumns();

  return (
    <GenericTable
      className="p-table--network-discoveries p-table-expanding--light"
      columns={columns}
      data={discoveries}
      data-testid="discoveries-table"
      isLoading={loading}
      noData={
        filtering
          ? "No discoveries match the search criteria."
          : "No discoveries available."
      }
      sortBy={[{ id: "last_seen", desc: false }]}
    />
  );
};

export default DiscoveriesTable;
