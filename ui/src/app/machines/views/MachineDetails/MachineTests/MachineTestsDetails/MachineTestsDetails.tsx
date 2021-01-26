import React, { useEffect } from "react";

import { Col, Row } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { scriptStatus } from "app/base/enum";
import type { RouteParams } from "app/base/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";

type DetailsRouteParams = RouteParams & { scriptResultId: string };

const MachineTestsDetails = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const params = useParams<DetailsRouteParams>();
  const { id, scriptResultId } = params;

  const scriptResults = useSelector((state: RootState) =>
    scriptResultSelectors.getByMachineId(state, id)
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

  if (result) {
    return (
      <>
        <Row className="u-sv2">
          <Col size="8">
            <h2 className="p-heading--four">{result.name} details</h2>
          </Col>
          <Col size="4">
            <Link to={`/machine/${id}/tests`}>
              &lsaquo; Back to test results
            </Link>
          </Col>
        </Row>
        <Row>
          <Col size="6">
            <Row>
              <Col size="2">Status</Col>
              <Col size="4">
                <i
                  className={classNames("is-inline", {
                    "p-icon--success": result.status === scriptStatus.PASSED,
                    "p-icon--error": result.status !== scriptStatus.PASSED,
                  })}
                />
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
      </>
    );
  }
  return null;
};

export default MachineTestsDetails;
