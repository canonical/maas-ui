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
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const MachineTable = ({
  clearTable,
  id,
}: {
  clearTable: () => void;
  id: string;
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hostnameFilter, setHostnameFilter] = useState("");
  const query = useSelector((state: RootState) =>
    machineSelectors.getQuery(state, id)
  );
  const machines = useSelector((state: RootState) =>
    machineSelectors.getByQueryParams(state, id)
  );

  useEffect(() => {
    dispatch(machineActions.query({ id, filter: "", page: 1, pageSize: 10 }));
  }, [dispatch, id]);

  if (!query) {
    return null;
  }

  const { count, loaded, params } = query;
  return (
    <>
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
        appearance="positive"
        onClick={() =>
          dispatch(
            machineActions.query({ id, filter: hostnameFilter, page, pageSize })
          )
        }
        type="button"
      >
        Update list
      </Button>
      <p>
        Showing{" "}
        {loaded ? (
          <>
            {(params.page - 1) * params.pageSize + 1} -{" "}
            {Math.min(count, params.page * params.pageSize)} of {count}
          </>
        ) : (
          "..."
        )}
      </p>
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
              <td>
                <Button
                  appearance="link"
                  className="u-no-margin--bottom"
                  onClick={() =>
                    dispatch(machineActions.setActive(machine.system_id))
                  }
                >
                  {machine.system_id}
                </Button>
              </td>
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
              setPage(page);
              dispatch(
                machineActions.query({
                  id,
                  filter: hostnameFilter,
                  page,
                  pageSize,
                })
              );
            }}
            totalItems={count}
          />
          <Button appearance="negative" onClick={clearTable}>
            Remove machine list
          </Button>
        </>
      ) : (
        <Spinner text="Loading..." />
      )}
    </>
  );
};

const ActiveMachine = (): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);

  return (
    <>
      <h4>Active machine</h4>
      {activeMachine ? (
        <>
          <table>
            <thead>
              <tr>
                <th>System ID</th>
                <th>Hostname</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{activeMachine.system_id}</td>
                <td>{activeMachine.hostname}</td>
              </tr>
            </tbody>
          </table>
          <Button
            appearance="negative"
            onClick={() => dispatch(machineActions.setActive(null))}
          >
            Clear active machine
          </Button>
        </>
      ) : (
        <p>No active machine set</p>
      )}
    </>
  );
};

const QueryMachines = (): JSX.Element => {
  const dispatch = useDispatch();
  const [queryIds, setQueryIds] = useState<string[]>([nanoid()]);
  const count = useSelector(machineSelectors.count);
  const countLoading = useSelector(machineSelectors.countLoading);

  useEffect(() => {
    dispatch(machineActions.count());

    return () => {
      dispatch(machineActions.setActive(null));
      dispatch(machineActions.clearAllQueries());
    };
  }, [dispatch]);

  return (
    <>
      <Strip shallow>
        <Row>
          <Col size={12}>
            <h4>
              This MAAS has {countLoading ? <Spinner /> : `${count} machines`}
            </h4>
          </Col>
        </Row>
        <Row>
          <Col size={6}>
            <Button
              appearance="positive"
              onClick={() => {
                setQueryIds([...queryIds, nanoid()]);
              }}
            >
              Add machine list
            </Button>
          </Col>
        </Row>
        <Row>
          {queryIds.map((queryId) => (
            <Col key={queryId} size={6}>
              <MachineTable
                clearTable={() => {
                  setQueryIds(queryIds.filter((id) => id !== queryId));
                  dispatch(machineActions.clearQuery(queryId));
                }}
                id={queryId}
              />
            </Col>
          ))}
        </Row>
      </Strip>
      <Strip shallow>
        <Row>
          <Col size={6}>
            <ActiveMachine />
          </Col>
        </Row>
      </Strip>
    </>
  );
};

export default QueryMachines;
