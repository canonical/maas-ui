import { Col, Row, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { getProcessingLabel } from "../utils";
import { generateLegacyURL } from "app/utils";
import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  scriptresults as scriptresultsSelectors,
} from "app/base/selectors";
import { useMachinesProcessing } from "app/machines/components/HeaderStrip/hooks";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";

const generateFailedTestsMessage = (numFailedTests, selectedMachines) => {
  const singleMachine = selectedMachines.length === 1 && selectedMachines[0];
  if (numFailedTests > 0) {
    const numFailedTestsString = `failed ${numFailedTests} ${pluralize(
      "test",
      numFailedTests
    )}.`;
    if (singleMachine) {
      const url = generateLegacyURL(`/machine/${singleMachine.system_id}`);
      return (
        <span>
          Machine <strong>{singleMachine.hostname}</strong> has{" "}
          <a
            href={url}
            onClick={(evt) => {
              evt.preventDefault();
              window.history.pushState(null, null, url);
            }}
          >
            {numFailedTestsString}
          </a>
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

export const OverrideTestForm = ({
  processing,
  setProcessing,
  setSelectedAction,
}) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
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

  useMachinesProcessing(
    overridingFailedTestingSelected,
    setProcessing,
    setSelectedAction,
    Object.keys(errors).length > 0
  );

  return (
    <FormikForm
      allowUnchanged
      buttons={FormCardButtons}
      buttonsBordered={false}
      disabled={!scriptResultsLoaded}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{
        suppressResults: false,
      }}
      submitLabel={`Override failed tests for ${
        selectedMachines.length
      } ${pluralize("machine", selectedMachines.length)}`}
      onCancel={() => setSelectedAction(null, true)}
      onSaveAnalytics={{
        action: "Override",
        category: "Take action menu",
        label: "Override failed tests for selected machines",
      }}
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
        setProcessing(true);
      }}
      loading={!scriptResultsLoaded}
      saving={processing}
      savingLabel={getProcessingLabel(
        overridingFailedTestingSelected.length,
        selectedMachines.length,
        "override-failed-testing"
      )}
      saved={saved}
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
                        <a
                          href={generateLegacyURL(
                            `/machine/${selectedMachines[0].system_id}`
                          )}
                          onClick={(evt) => {
                            evt.preventDefault();
                            window.history.pushState(
                              null,
                              null,
                              generateLegacyURL(
                                `/machine/${selectedMachines[0].system_id}`
                              )
                            );
                          }}
                        >
                          Machine &gt; Hardware tests
                        </a>
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
    </FormikForm>
  );
};

OverrideTestForm.propTypes = {
  processing: PropTypes.bool,
  setProcessing: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default OverrideTestForm;
