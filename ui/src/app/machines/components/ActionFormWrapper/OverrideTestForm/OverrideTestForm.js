import { Col, Row, Spinner } from "@canonical/react-components";
import { Link } from "react-router-dom";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { machine as machineActions } from "app/base/actions";
import { useMachineActionForm } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import scriptResultsSelectors from "app/store/scriptresults/selectors";
import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";

const generateFailedTestsMessage = (numFailedTests, selectedMachines) => {
  const singleMachine = selectedMachines.length === 1 && selectedMachines[0];
  if (numFailedTests > 0) {
    const numFailedTestsString = `failed ${numFailedTests} ${pluralize(
      "test",
      numFailedTests
    )}.`;
    if (singleMachine) {
      return (
        <span>
          Machine <strong>{singleMachine.hostname}</strong> has{" "}
          <Link to={`/machine/${singleMachine.system_id}`}>
            {numFailedTestsString}
          </Link>
        </span>
      );
    }
    return (
      <span>
        <strong>{selectedMachines.length} machines</strong> have{" "}
        {numFailedTestsString}
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
          <strong>{selectedMachines.length} machines</strong> have
        </span>
      )}{" "}
      not failed any tests. This can occur if the test suite failed to start.
    </>
  );
};

const OverrideTestFormSchema = Yup.object().shape({
  suppressResults: Yup.boolean(),
});

export const OverrideTestForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const errors = useSelector(machineSelectors.errors);
  const scriptResultsLoaded = useSelector(scriptResultsSelectors.loaded);
  const { machinesToAction, processingCount } = useMachineActionForm(
    "override-failed-testing"
  );
  const machineIDs = machinesToAction.map((machine) => machine.system_id);
  const scriptResults = useSelector((state) =>
    scriptResultsSelectors.getByIds(state, machineIDs)
  );

  const numFailedTests =
    scriptResults.reduce((acc, curr) => acc + curr.results.length, 0) || 0;

  useEffect(() => {
    dispatch(machineActions.fetchFailedScriptResults(machinesToAction));
  }, [dispatch, machinesToAction]);

  return (
    <ActionForm
      actionName="override-failed-testing"
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      disabled={!scriptResultsLoaded}
      errors={errors}
      initialValues={{
        suppressResults: false,
      }}
      loaded={scriptResultsLoaded}
      loading={!scriptResultsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Override failed tests",
      }}
      onSubmit={(values) => {
        const { suppressResults } = values;
        machinesToAction.forEach((machine) => {
          dispatch(machineActions.overrideFailedTesting(machine.system_id));
        });
        if (suppressResults) {
          machinesToAction.forEach((machine) => {
            const resultsForMachine = scriptResults.find(
              (result) => result.id === machine.system_id
            );
            if (resultsForMachine) {
              dispatch(
                machineActions.suppressScriptResults(
                  machine.system_id,
                  resultsForMachine.results
                )
              );
            }
          });
        }
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={OverrideTestFormSchema}
    >
      <Row>
        <Col size="6">
          {!scriptResultsLoaded ? (
            <p>
              <Spinner
                className="u-no-padding u-no-margin"
                inline
                text="Loading script results..."
              />
            </p>
          ) : (
            <>
              <p data-test-id="failed-results-message">
                <i className="p-icon--warning is-inline"></i>
                {generateFailedTestsMessage(numFailedTests, machinesToAction)}
              </p>
              <p className="u-sv1">
                Overriding will allow the machines to be deployed, marked with a
                warning.
              </p>
              {numFailedTests > 0 && (
                <FormikField
                  label={
                    <span>
                      Suppress test-failure icons in the machines list. Results
                      remain visible in
                      <br />
                      {machinesToAction.length === 1 ? (
                        <Link to={`/machine/${machinesToAction[0].system_id}`}>
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
          )}
        </Col>
      </Row>
    </ActionForm>
  );
};

OverrideTestForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default OverrideTestForm;
