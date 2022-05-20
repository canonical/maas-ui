import { useEffect, useState } from "react";

import {
  Button,
  Col,
  Input,
  Pagination,
  Row,
  Spinner,
  Strip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

let id = 0;

const MachineTable = ({
  clearTable,
  hostnameFilter,
  pageSize,
}: {
  clearTable: () => void;
  hostnameFilter: string;
  pageSize: number;
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const query = useSelector((state: RootState) =>
    machineSelectors.getQuery(state, "list", {
      page,
      pageSize,
      search_hostname: hostnameFilter,
    })
  );
  const machines = useSelector((state: RootState) =>
    machineSelectors.getByQueryParams(state, "list", {
      page,
      pageSize,
      search_hostname: hostnameFilter,
    })
  );

  useEffect(() => {
    dispatch(
      machineActions.queryList({
        page,
        pageSize,
        search_hostname: hostnameFilter,
      })
    );

    return () => {
      dispatch(
        machineActions.clearQuery({
          method: "list",
          params: {
            page,
            pageSize,
            search_hostname: hostnameFilter,
          },
        })
      );
    };
  }, [dispatch, hostnameFilter, page, pageSize]);

  return (
    <>
      <span>
        Page size: {pageSize}, Hostname filter: "{hostnameFilter}"
        {query?.loaded && (
          <>
            <br />
            Showing {(page - 1) * pageSize + 1} -{" "}
            {Math.min(query.count, page * pageSize)} of {query.count}
          </>
        )}
      </span>
      <table>
        <thead>
          <tr>
            <th>System ID</th>
            <th>Hostname</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.system_id}>
              <td>{machine.system_id}</td>
              <td>{machine.hostname}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {query?.loaded ? (
        <>
          {machines.length === 0 && <p>No machines match this query</p>}
          <Pagination
            currentPage={page}
            itemsPerPage={pageSize}
            paginate={(page) => {
              dispatch(
                machineActions.clearQuery({
                  method: "list",
                  params: {
                    page,
                    pageSize,
                    search_hostname: hostnameFilter,
                  },
                })
              );
              setPage(page);
            }}
            totalItems={query.count}
          />
          <Button appearance="negative" onClick={clearTable}>
            Clear table
          </Button>
        </>
      ) : (
        <Spinner text="Loading..." />
      )}
    </>
  );
};

const QueryMachines = (): JSX.Element => {
  const dispatch = useDispatch();
  const [tables, setTables] = useState<
    {
      id: number;
      hostnameFilter: string;
      pageSize: number;
    }[]
  >([]);
  const [pageSize, setPageSize] = useState(10);
  const [hostnameFilter, setHostnameFilter] = useState("");
  const queryExists = tables.some(
    (table) =>
      table.hostnameFilter === hostnameFilter && table.pageSize === pageSize
  );

  useEffect(() => {
    return () => {
      dispatch(machineActions.clearAllQueries());
    };
  }, [dispatch]);

  return (
    <Strip>
      <Row>
        <Col size={6}>
          <h4>Add query</h4>
          <Input
            label="Page size"
            onChange={(e) => setPageSize(Number(e.target.value))}
            type="text"
            value={pageSize}
          />
          <Input
            label="Filter by hostname"
            onChange={(e) => setHostnameFilter(e.target.value)}
            type="text"
            value={hostnameFilter}
          />
          <Button
            disabled={queryExists}
            onClick={() => {
              setTables([...tables, { hostnameFilter, id, pageSize }]);
              id++;
            }}
          >
            Add query
          </Button>
          {queryExists && <span>This query already exists.</span>}
        </Col>
      </Row>
      <Row>
        {Object.entries(tables).map(([, params]) => (
          <Col key={params.id} size={6}>
            <MachineTable
              clearTable={() =>
                setTables(tables.filter((table) => table.id !== params.id))
              }
              hostnameFilter={params.hostnameFilter}
              pageSize={params.pageSize}
            />
          </Col>
        ))}
      </Row>
    </Strip>
  );
};

export default QueryMachines;
