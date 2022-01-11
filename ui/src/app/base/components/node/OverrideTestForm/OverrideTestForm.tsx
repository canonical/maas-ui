import { useEffect, useState } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";

import type { NodeActionFormProps } from "../types";

import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultsSelectors from "app/store/scriptresult/selectors";
import type { ScriptResult } from "app/store/scriptresult/types";
import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { capitaliseFirst } from "app/utils";

type Props<E = null> = NodeActionFormProps<E> & {
  cleanup: NonNullable<NodeActionFormProps<E>["cleanup"]>;
  getNodeUrl: (systemId: Node["system_id"]) => string;
  onOverrideFailedTesting: (systemId: Node["system_id"]) => void;
  onSuppressScriptResults: (
    systemId: Node["system_id"],
    scriptResults: ScriptResult[]
  ) => void;
};

export type OverrideTestFormValues = {
  suppressResults: boolean;
};

const generateFailedTestsMessage = (
  numFailedTests: number,
  selectedNodes: Node[],
  getNodeUrl: (systemId: Node["system_id"]) => string,
  modelName: string,
  displayName: string
) => {
  const singleNode = selectedNodes.length === 1 && selectedNodes[0];
  if (numFailedTests > 0) {
    const numFailedTestsString = `failed ${numFailedTests} ${pluralize(
      "test",
      numFailedTests
    )}.`;
    if (singleNode) {
      return (
        <span>
          {displayName} <strong>{singleNode.hostname}</strong> has{" "}
          <Link to={getNodeUrl(singleNode.system_id)}>
            {numFailedTestsString}
          </Link>
        </span>
      );
    }
    return (
      <span>
        <strong>{pluralize(modelName, selectedNodes.length, true)}</strong> have{" "}
        {numFailedTestsString}
      </span>
    );
  }
  return (
    <>
      {singleNode ? (
        <span>
          {displayName} <strong>{singleNode.hostname}</strong> has
        </span>
      ) : (
        <span>
          <strong>{pluralize(modelName, selectedNodes.length, true)}</strong>{" "}
          have
        </span>
      )}{" "}
      not failed any tests. This can occur if the test suite failed to start.
    </>
  );
};

const OverrideTestFormSchema = Yup.object().shape({
  suppressResults: Yup.boolean(),
});

export const OverrideTestForm = <E,>({
  cleanup,
  clearHeaderContent,
  errors,
  getNodeUrl,
  modelName,
  nodes,
  onOverrideFailedTesting,
  onSuppressScriptResults,
  processingCount,
  viewingDetails,
}: Props<E>): JSX.Element => {
  const dispatch = useDispatch();
  const [requestedScriptResults, setRequestedScriptResults] = useState<
    Node["system_id"][]
  >([]);
  const scriptResultsLoaded = useSelector(scriptResultsSelectors.loaded);
  const scriptResultsLoading = useSelector(scriptResultsSelectors.loading);
  const nodeIDs = nodes.map((node) => node.system_id);
  const scriptResults = useSelector((state: RootState) =>
    scriptResultsSelectors.getFailedTestingResultsByNodeIds(state, nodeIDs)
  );
  // Get the number of results for all nodes.
  const numFailedTests =
    Object.entries(scriptResults).reduce(
      // Count the results for this node.
      (acc, [, results]) => acc + results.length,
      0
    ) || 0;
  const displayName = capitaliseFirst(modelName);

  useEffect(() => {
    const newRequests: Node["system_id"][] = [];
    nodeIDs.forEach((id) => {
      // Check that the results haven't already been requested.
      // This fetches the results even if they've been loaded previously so that
      // we make sure the data is not stale.
      if (!requestedScriptResults.includes(id)) {
        dispatch(scriptResultActions.getByNodeId(id));
        newRequests.push(id);
      }
    });
    if (newRequests.length > 0) {
      // Store the requested ids so that they're not requested again.
      setRequestedScriptResults(requestedScriptResults.concat(newRequests));
    }
  }, [dispatch, scriptResultsLoading, nodeIDs, requestedScriptResults]);

  return (
    <ActionForm<OverrideTestFormValues, E>
      actionName={NodeActions.OVERRIDE_FAILED_TESTING}
      allowUnchanged
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        suppressResults: false,
      }}
      loaded={scriptResultsLoaded}
      loading={scriptResultsLoading}
      modelName={modelName}
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `${displayName} ${
          viewingDetails ? "details" : "list"
        } action form`,
        label: "Override failed tests",
      }}
      onSubmit={(values) => {
        dispatch(cleanup());
        const { suppressResults } = values;
        nodes.forEach((node) => {
          onOverrideFailedTesting(node.system_id);
        });
        if (suppressResults) {
          nodes.forEach((node) => {
            if (
              node.system_id in scriptResults &&
              scriptResults[node.system_id].length > 0
            ) {
              onSuppressScriptResults(
                node.system_id,
                scriptResults[node.system_id]
              );
            }
          });
        }
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={nodes.length}
      validationSchema={OverrideTestFormSchema}
    >
      <Row>
        <Col size={6}>
          {!scriptResultsLoaded ? (
            <p>
              <Spinner
                className="u-no-padding u-no-margin"
                text="Loading script results..."
              />
            </p>
          ) : (
            <>
              <p data-testid-id="failed-results-message">
                <i className="p-icon--warning is-inline"></i>
                {generateFailedTestsMessage(
                  numFailedTests,
                  nodes,
                  getNodeUrl,
                  modelName,
                  displayName
                )}
              </p>
              <p className="u-sv1">
                Overriding will allow the nodes to be deployed, marked with a
                warning.
              </p>
              {numFailedTests > 0 && (
                <FormikField
                  label={
                    <span>
                      Suppress test-failure icons in the nodes list. Results
                      remain visible in
                      <br />
                      {nodes.length === 1 ? (
                        <Link to={getNodeUrl(nodes[0].system_id)}>
                          {displayName} &gt; Hardware tests
                        </Link>
                      ) : (
                        `${displayName} > Hardware tests`
                      )}
                      .
                    </span>
                  }
                  name="suppressResults"
                  type="checkbox"
                />
              )}
            </>
          )}
        </Col>
      </Row>
    </ActionForm>
  );
};

export default OverrideTestForm;
