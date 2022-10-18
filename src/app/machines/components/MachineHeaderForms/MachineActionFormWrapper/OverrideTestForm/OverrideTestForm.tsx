/* eslint-disable react/no-multi-comp */
import { useEffect, useMemo, useState } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";
import * as Yup from "yup";

import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";
import urls from "app/base/urls";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type {
  Machine,
  MachineEventErrors,
  MachineMeta,
} from "app/store/machine/types";
import {
  useFetchMachine,
  useSelectedMachinesActionsDispatch,
} from "app/store/machine/utils/hooks";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultsSelectors from "app/store/scriptresult/selectors";
import { NodeActions } from "app/store/types/node";

type Props = MachineActionFormProps;

export type OverrideTestFormValues = {
  suppressResults: boolean;
};

const FailedTestsMessage = ({
  numFailedTests,
  selectedCount,
  singleMachine,
}: {
  numFailedTests: number;
  singleMachine: Machine | null;
} & Pick<MachineActionFormProps, "selectedCount">): JSX.Element => {
  if (numFailedTests > 0) {
    const numFailedTestsString = `failed ${numFailedTests} ${pluralize(
      "test",
      numFailedTests
    )}.`;
    if (singleMachine) {
      return (
        <span>
          Machine <strong>{singleMachine.hostname}</strong> has{" "}
          <Link
            to={urls.machines.machine.index({ id: singleMachine.system_id })}
          >
            {numFailedTestsString}
          </Link>
        </span>
      );
    }
    return (
      <span>
        <strong>{selectedCount} machines</strong> have {numFailedTestsString}
      </span>
    );
  }
  return (
    <>
      {singleMachine ? (
        <span>
          Machine <strong>{singleMachine.hostname}</strong> has
        </span>
      ) : (
        <span>
          <strong>{selectedCount} machines</strong> have
        </span>
      )}{" "}
      not failed any tests. This can occur if the test suite failed to start.
    </>
  );
};

const OverrideTestFormSchema = Yup.object().shape({
  suppressResults: Yup.boolean(),
});

export const OverrideTestForm = ({
  clearHeaderContent,
  errors,
  processingCount,
  searchFilter,
  selectedCount,
  selectedMachines,
  viewingDetails,
}: Props): JSX.Element => {
  const isSingleMachine = selectedCount === 1;
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  const [requestedScriptResults, setRequestedScriptResults] = useState<
    Machine[MachineMeta.PK][]
  >([]);
  const scriptResultsLoaded = useSelector(scriptResultsSelectors.loaded);
  const scriptResultsLoading = useSelector(scriptResultsSelectors.loading);
  // TODO: allow suppressing results for multiple machines via filter once the API supports it
  // https://github.com/canonical/app-tribe/issues/1427
  const machineIDs = useMemo(
    () =>
      isSingleMachine
        ? (selectedMachines &&
            "items" in selectedMachines &&
            selectedMachines?.items) ||
          []
        : [],
    [isSingleMachine, selectedMachines]
  );
  const { machine } = useFetchMachine(isSingleMachine ? machineIDs[0] : null);

  const scriptResults = useSelector((state: RootState) =>
    scriptResultsSelectors.getFailedTestingResultsByNodeIds(state, machineIDs)
  );
  // Get the number of results for all machines.
  const numFailedTests =
    Object.entries(scriptResults).reduce(
      // Count the results for this machine.
      (acc, [, results]) => acc + results.length,
      0
    ) || 0;

  useEffect(() => {
    const newRequests: Machine[MachineMeta.PK][] = [];
    machineIDs?.forEach((id) => {
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
  }, [dispatch, scriptResultsLoading, machineIDs, requestedScriptResults]);

  return (
    <ActionForm<OverrideTestFormValues, MachineEventErrors>
      actionName={NodeActions.OVERRIDE_FAILED_TESTING}
      allowUnchanged
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        suppressResults: false,
      }}
      modelName="machine"
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Override failed tests",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        const { suppressResults } = values;
        if (selectedMachines) {
          dispatchForSelectedMachines(machineActions.overrideFailedTesting);
        }
        if (suppressResults) {
          machineIDs?.forEach((system_id) => {
            if (
              system_id in scriptResults &&
              scriptResults[system_id].length > 0
            ) {
              dispatch(
                machineActions.suppressScriptResults(
                  system_id,
                  scriptResults[system_id]
                )
              );
            }
          });
        }
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={selectedCount}
      validationSchema={OverrideTestFormSchema}
      {...actionProps}
    >
      <Row>
        <Col size={6}>
          <>
            {/* TODO: display failed tests message for multiple machines
              once the API supports it https://github.com/canonical/app-tribe/issues/1427 */}
            {isSingleMachine ? (
              <p data-testid="failed-results-message">
                <i className="p-icon--warning is-inline"></i>

                <FailedTestsMessage
                  numFailedTests={numFailedTests}
                  selectedCount={selectedCount}
                  singleMachine={machine}
                />
              </p>
            ) : null}
            <p className="u-sv1">
              Overriding will allow the machines to be deployed, marked with a
              warning.
            </p>
            {isSingleMachine && !scriptResultsLoaded ? (
              <p>
                <Spinner
                  className="u-no-padding u-no-margin"
                  text="Loading script results..."
                />
              </p>
            ) : null}
            {numFailedTests > 0 && (
              <FormikField
                label={
                  <span>
                    Suppress test-failure icons in the machines list. Results
                    remain visible in
                    <br />
                    {machine ? (
                      <Link
                        to={urls.machines.machine.index({
                          id: machine.system_id,
                        })}
                      >
                        Machine &gt; Hardware tests
                      </Link>
                    ) : (
                      "Machine > Hardware tests"
                    )}
                    .
                  </span>
                }
                name="suppressResults"
                type="checkbox"
              />
            )}
          </>
        </Col>
      </Row>
    </ActionForm>
  );
};

export default OverrideTestForm;
