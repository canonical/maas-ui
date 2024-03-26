import {
  Col,
  Spinner,
  MainTable,
  Notification,
  Row,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TableActions from "@/app/base/components/TableActions";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { FilterMachines } from "@/app/store/machine/utils";
import { resourcePoolActions } from "@/app/store/resourcepool";
import resourcePoolSelectors from "@/app/store/resourcepool/selectors";
import type { ResourcePool } from "@/app/store/resourcepool/types";
import { formatErrors } from "@/app/utils";

export enum Label {
  Title = "Pool list",
}

const getMachinesLabel = (row: ResourcePool) => {
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

const generateRows = (rows: ResourcePool[]) =>
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
  const dispatch = useDispatch();

  const poolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const poolsLoading = useSelector(resourcePoolSelectors.loading);
  const errors = useSelector(resourcePoolSelectors.errors);
  const errorMessage = formatErrors(errors);

  useFetchActions([resourcePoolActions.fetch]);

  const resourcePools = useSelector(resourcePoolSelectors.all);

  return (
    <div aria-label={Label.Title}>
      {errorMessage ? (
        <Row>
          <Col size={12}>
            <Notification
              onDismiss={() => dispatch(resourcePoolActions.cleanup())}
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
            {poolsLoading && (
              <div className="u-align--center">
                <Spinner text="Loading..." />
              </div>
            )}
            {poolsLoaded && (
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
                rows={generateRows(resourcePools)}
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
