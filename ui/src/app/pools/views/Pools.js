import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Link,
  Loader,
  MainTable,
  Row
} from "@canonical/react-components";

import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import Tooltip from "app/base/components/Tooltip";
import {
  machine as machineActions,
  resourcepool as resourcePoolActions
} from "app/base/actions";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import { resourcepool as resourcePoolSelectors } from "app/base/selectors";

const getMachinesLabel = row => {
  if (row.machine_total_count === 0) {
    return "Empty pool";
  }
  return `${row.machine_ready_count} of ${row.machine_total_count} ready`;
};

const generateRows = (rows, expandedId, setExpandedId, dispatch, setDeleting) =>
  rows.map(row => {
    const expanded = expandedId === row.id;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: row.name
        },
        {
          content: getMachinesLabel(row)
        },
        {
          content: row.description
        },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                hasIcon
                to={`/pools/${row.id}/edit`}
                className="is-dense u-table-cell-padding-overlap"
                disabled={!row.permissions.includes("edit")}
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              <Tooltip
                position="left"
                message={
                  row.is_default && "The default pool may not be deleted."
                }
              >
                <Button
                  appearance="base"
                  className="is-dense u-table-cell-padding-overlap"
                  hasIcon
                  disabled={
                    !row.permissions.includes("delete") || row.is_default
                  }
                  onClick={() => setExpandedId(row.id)}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              </Tooltip>
            </>
          ),
          className: "u-align--right"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <TableDeleteConfirm
          modelName={row.name}
          modelType="resourcepool"
          onCancel={setExpandedId}
          onConfirm={() => {
            dispatch(resourcePoolActions.delete(row.id));
            setDeleting(row.name);
            setExpandedId();
          }}
        />
      ),
      key: row.name,
      sortData: {
        name: row.name,
        machines: row.machine_total_count,
        description: row.description
      }
    };
  });

const Pools = () => {
  useWindowTitle("Pools");
  const dispatch = useDispatch();

  const [expandedId, setExpandedId] = useState(null);
  const [deletingPool, setDeleting] = useState();

  const poolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const poolsLoading = useSelector(resourcePoolSelectors.loading);
  const saved = useSelector(resourcePoolSelectors.saved);

  useAddMessage(
    saved,
    resourcePoolActions.cleanup,
    `${deletingPool} removed successfully.`,
    setDeleting
  );

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  const resourcePools = useSelector(resourcePoolSelectors.all);

  return (
    <Row>
      <Col size={12}>
        <div>
          {poolsLoading && (
            <div className="u-align--center">
              <Loader text="Loading..." />
            </div>
          )}
          {poolsLoaded && (
            <MainTable
              className="p-table-expanding--light"
              defaultSortDirection="ascending"
              headers={[
                {
                  content: "Name",
                  sortKey: "name"
                },
                {
                  content: "Machines",
                  sortKey: "machines"
                },
                {
                  content: "Description",
                  sortKey: "description"
                },
                {
                  content: "Actions",
                  className: "u-align--right"
                }
              ]}
              expanding={true}
              paginate={150}
              rows={generateRows(
                resourcePools,
                expandedId,
                setExpandedId,
                dispatch,
                setDeleting
              )}
              sortable
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Pools;
