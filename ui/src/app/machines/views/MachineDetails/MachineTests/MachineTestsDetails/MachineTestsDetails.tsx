import React, { useEffect } from "react";

import { Col, Row, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";

import { getTestResultsIcon } from "../../utils";

import MachineTestsDetailsLogs from "./MachineTestsDetailsLogs";

import type { RouteParams } from "app/base/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type { ScriptResultResult } from "app/store/scriptresult/types";

type DetailsRouteParams = RouteParams & { scriptResultId: string };

const MachineTestsDetails = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const params = useParams<DetailsRouteParams>();
  const { id, scriptResultId } = params;

  const returnPath = useLocation().pathname.split("/")?.[3];

  const scriptResults = useSelector((state: RootState) =>
    scriptResultSelectors.getByMachineId(state, id)
  );

  const logs = useSelector((state: RootState) =>
    scriptResultSelectors.logs(state)
  );

  const loading = useSelector((state: RootState) =>
    scriptResultSelectors.loading(state)
  );

  const result = scriptResults?.find(
    (result) => result.id === parseInt(scriptResultId, 10)
  );

  useEffect(() => {
    if (!scriptResults?.length && !loading) {
      dispatch(scriptResultActions.getByMachineId(id));
    }
  }, [dispatch, scriptResults, loading, id]);

  useEffect(() => {
    if (!(logs && logs[id]) && result) {
      ["combined", "stdout", "stderr", "result"].forEach((type) =>
        dispatch(scriptResultActions.getLogs(result.id, type))
      );
    }
  }, [dispatch, result, logs, id]);

  const log = logs ? logs[parseInt(scriptResultId, 10)] : null;

  if (result) {
    const hasMetrics = result.results.length > 0;
    return (
      <>
        <Row className="u-sv2">
          <Col size="8">
            <h2 className="p-heading--four">{result.name} details</h2>
          </Col>
          <Col size="4" className="u-align--right">
            <Link to={`/machine/${id}/${returnPath}`}>
              &lsaquo; Back to test results
            </Link>
          </Col>
        </Row>
        <Row className="u-sv2">
          <Col size="6">
            <Row>
              <Col size="2">Status</Col>
              <Col size="4">
                <i className={`is-inline ${getTestResultsIcon(result)}`} />
                <span data-test="status-name">{result.status_name}</span>
              </Col>
            </Row>
            <Row>
              <Col size="2">Exit status</Col>
              <Col size="4">{result.exit_status}</Col>
            </Row>
            <Row>
              <Col size="2">Tags</Col>
              <Col size="4">{result.tags}</Col>
            </Row>
          </Col>
          <Col size="6">
            <Row>
              <Col size="2">Start time</Col>
              <Col size="4">{result.started}</Col>
            </Row>
            <Row>
              <Col size="2">End time</Col>
              <Col size="4">{result.ended}</Col>
            </Row>
            <Row>
              <Col size="2">Runtime</Col>
              <Col size="4">{result.runtime}</Col>
            </Row>
          </Col>
        </Row>
        {hasMetrics ? (
          <Row>
            <Col size="12">
              <h4>Metrics</h4>
              <table role="grid" data-test="script-details-metrics">
                <tbody>
                  {result.results.map((item: ScriptResultResult) => (
                    <tr role="row" key={`metric-${item.name}`}>
                      <td role="gridcell">
                        <Tooltip message={item.description}>
                          {item.title}
                        </Tooltip>
                      </td>
                      <td role="gridcell">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        ) : null}
        {log ? (
          <Row>
            <Col size="12">
              <h4>Output</h4>
              <MachineTestsDetailsLogs log={log} />
            </Col>
          </Row>
        ) : null}
      </>
    );
  }
  return null;
};

export default MachineTestsDetails;
