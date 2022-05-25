import { useEffect, useState } from "react";

import {
  Button,
  Col,
  Input,
  Pagination,
  Row,
  Select,
  Spinner,
  Strip,
} from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const MachineTable = ({
  id,
  queryIds,
  setQueryIds,
}: {
  id: string;
  queryIds: string[];
  setQueryIds: (ids: string[]) => void;
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hostnameFilter, setHostnameFilter] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const query = useSelector((state: RootState) =>
    machineSelectors.getQuery(state, id)
  );
  const machineGroups = useSelector((state: RootState) =>
    machineSelectors.getGroupsByQuery(state, id)
  );
  const unsubscribeIds = useSelector((state: RootState) =>
    machineSelectors.getForUnsubscribe(state, id)
  );

  useEffect(() => {
    dispatch(
      machineActions.query({
        id,
        filter: "",
        groupBy: "",
        page: 1,
        pageSize: 10,
      })
    );

    return () => {
      dispatch(machineActions.clearQuery(id));
    };
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
      <Select
        label="Group by"
        onChange={(e) => setGroupBy(e.target.value)}
        options={[
          { label: "None", value: "" },
          { label: "Owner", value: "owner" },
        ]}
      />
      <Button
        appearance="positive"
        onClick={() => {
          setPage(1);
          dispatch(
            machineActions.query({
              id,
              filter: hostnameFilter,
              groupBy,
              page: 1,
              pageSize,
            })
          );
          dispatch(machineActions.unsubscribe(unsubscribeIds));
        }}
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
          {machineGroups.map((group) => (
            <>
              {group.name !== null && (
                <tr key={`${group.name}`}>
                  <td colSpan={2}>
                    {group.name || "No owner"} ({group.count})
                  </td>
                </tr>
              )}
              {group.items.map((machine) => (
                <tr key={machine.system_id}>
                  <td>
                    <Button
                      appearance="link"
                      className="u-no-margin--bottom"
                      onClick={() => {
                        dispatch(machineActions.setActive(machine.system_id));
                      }}
                    >
                      {machine.system_id}
                    </Button>
                  </td>
                  <td>{machine.hostname}</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
      {query?.loaded ? (
        <>
          {query.count === 0 && <p>No machines match this query</p>}
          <Pagination
            currentPage={page}
            itemsPerPage={pageSize}
            paginate={(page) => {
              setPage(page);
              dispatch(
                machineActions.query({
                  id,
                  filter: hostnameFilter,
                  groupBy,
                  page,
                  pageSize,
                })
              );
              dispatch(machineActions.unsubscribe(unsubscribeIds));
            }}
            totalItems={count}
          />
          <Button
            appearance="negative"
            onClick={() => {
              setQueryIds(queryIds.filter((queryId) => queryId !== id));
              dispatch(machineActions.unsubscribe(unsubscribeIds));
            }}
          >
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
      dispatch(machineActions.clearAllQueries());
      dispatch(machineActions.unsubscribeAll());
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
                id={queryId}
                queryIds={queryIds}
                setQueryIds={setQueryIds}
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
