import { Col, Row, Spinner } from "@canonical/react-components";
import { Link } from "react-router-dom";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { machine as machineActions } from "app/base/actions";
import machineSelectors from "app/store/machine/selectors";
import scriptresultsSelectors from "app/store/scriptresults/selectors";
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
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const scriptResultsLoaded = useSelector(scriptresultsSelectors.loaded);
  const failedScriptResults = useSelector(machineSelectors.failedScriptResults);
  const overridingFailedTestingSelected = useSelector(
    machineSelectors.overridingFailedTestingSelected
  );
  const numFailedTests = Object.values(failedScriptResults)?.flat().length || 0;

  useEffect(() => {
    dispatch(machineActions.fetchFailedScriptResults(selectedMachines));
  }, [dispatch, selectedMachines]);

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
      loading={!scriptResultsLoaded}
      modelName="machine"
      onSubmit={(values) => {
        const { suppressResults } = values;
        selectedMachines.forEach((machine) => {
          dispatch(machineActions.overrideFailedTesting(machine.system_id));
        });
        if (suppressResults) {
          selectedMachines.forEach((machine) => {
            if (machine.system_id in failedScriptResults) {
              dispatch(
                machineActions.suppressScriptResults(
                  machine,
                  failedScriptResults[machine.system_id]
                )
              );
            }
          });
        }
      }}
      processingCount={overridingFailedTestingSelected.length}
      selectedCount={selectedMachines.length}
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
                {generateFailedTestsMessage(numFailedTests, selectedMachines)}
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
                      {selectedMachines.length === 1 ? (
                        <Link to={`/machine/${selectedMachines[0].system_id}`}>
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
