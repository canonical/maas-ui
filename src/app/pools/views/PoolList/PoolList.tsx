import {
  Col,
  Spinner,
  MainTable,
  Notification,
  Row,
} from "@canonical/react-components";
import { Link } from "react-router-dom";

import TableActions from "@/app/base/components/TableActions";
import { useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { FilterMachines } from "@/app/store/machine/utils";
import { formatErrors } from "@/app/utils";
import { useListPools } from "@/app/api/query/pools";
import { ResourcePoolWithSummaryResponse } from "@/app/apiclient";

export enum Label {
  Title = "Pool list",
}

const getMachinesLabel = (row: ResourcePoolWithSummaryResponse) => {
  if (row.machine_total_count === 0) {
    return "Empty pool";
  }
  const filters = FilterMachines.filtersToQueryString({
    pool: [`=${row.name}`],
  });
  return (
    <Link to={`${urls.machines.index}${filters}`}>
      {`${row.machine_ready_count} of ${row.machine_total_count} ready`}
    </Link>
  );
};

const generateRows = (rows: ResourcePoolWithSummaryResponse[]) =>
  rows.map((row) => {
    return {
      "aria-label": row.name,
      columns: [
        {
          content: row.name,
        },
        {
          content: getMachinesLabel(row),
        },
        {
          content: row.description,
        },
        {
          content: (
            <TableActions
              deleteDisabled={
                !row.permissions.includes("delete") ||
                row.is_default ||
                row.machine_total_count > 0
              }
              deletePath={urls.pools.delete({ id: row.id })}
              deleteTooltip={
                (row.is_default && "The default pool may not be deleted.") ||
                (row.machine_total_count > 0 &&
                  "Cannot delete a pool that contains machines.") ||
                null
              }
              editDisabled={!row.permissions.includes("edit")}
              editPath={urls.pools.edit({ id: row.id })}
            />
          ),
          className: "u-align--right",
        },
      ],
      key: row.name,
      sortData: {
        name: row.name,
        machines: row.machine_total_count,
        description: row.description,
      },
    };
  });

const Pools = (): JSX.Element => {
  useWindowTitle("Pools");

  const listPools = useListPools();
  const errorMessage = formatErrors(listPools.error);
  const listPoolsResources = listPools.data?.items || [];

  return (
    <div aria-label={Label.Title}>
      {errorMessage ? (
        <Row>
          <Col size={12}>
            <Notification
              severity="negative"
            >
              {errorMessage}
            </Notification>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col size={12}>
          <div>
            {listPools.isLoading && (
              <div className="u-align--center">
                <Spinner text="Loading..." />
              </div>
            )}
            {listPools.isSuccess && (
              <MainTable
                className="p-table-expanding--light"
                defaultSortDirection="ascending"
                emptyStateMsg="No pools available."
                expanding={true}
                headers={[
                  {
                    content: "Name",
                    sortKey: "name",
                  },
                  {
                    content: "Machines",
                    sortKey: "machines",
                  },
                  {
                    content: "Description",
                    sortKey: "description",
                  },
                  {
                    content: "Actions",
                    className: "u-align--right",
                  },
                ]}
                paginate={50}
                rows={generateRows(listPoolsResources)}
                sortable
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Pools;
