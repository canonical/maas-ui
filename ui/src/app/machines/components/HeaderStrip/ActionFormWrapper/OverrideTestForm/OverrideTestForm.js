import pluralize from "pluralize";
import { Col, Row, Loader } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  scriptresults as scriptresultsSelectors,
} from "app/base/selectors";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import MachinesProcessing from "../MachinesProcessing";

const OverrideTestFormSchema = Yup.object().shape({
  suppressResults: Yup.boolean(),
});

export const OverrideTestForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const errors = useSelector(machineSelectors.errors);
  const scriptResultsLoaded = useSelector(scriptresultsSelectors.loaded);
  const failedScriptResults = useSelector(machineSelectors.failedScriptResults);
  const overridingFailedTestingSelected = useSelector(
    machineSelectors.overridingFailedTestingSelected
  );

  useEffect(() => {
    dispatch(machineActions.fetchFailedScriptResults(selectedMachines));
  }, [dispatch, selectedMachines]);

  if (processing) {
    return (
      <MachinesProcessing
        hasErrors={Object.keys(errors).length > 0}
        machinesProcessing={overridingFailedTestingSelected}
        setProcessing={setProcessing}
        setSelectedAction={setSelectedAction}
        action="override-failed-testing"
      />
    );
  }

  const generateFailedTestsMessage = (
    selectedMachines,
    failedScriptResults
  ) => {
    const numFailedTests =
      Object.values(failedScriptResults)?.flat().length || 0;

    if (selectedMachines.length === 1) {
      const hostname = selectedMachines[0].hostname;
      const id = selectedMachines[0].system_id;
      return (
        <span data-test-id="failed-results-message">
          Machine <strong>{hostname}</strong> has
          <a href={`${process.env.REACT_APP_BASENAME}/#/machine/${id}`}>
            {` failed ${numFailedTests} ${pluralize("test", numFailedTests)}.`}
          </a>
        </span>
      );
    } else {
      return (
        <span data-test-id="failed-results-message">
          <strong>{selectedMachines.length} machines</strong>
          {` have failed ${numFailedTests} ${pluralize(
            "test",
            numFailedTests
          )}.`}
        </span>
      );
    }
  };

  return (
    <>
      <i className="p-icon--warning is-inline"></i>
      {scriptResultsLoaded ? (
        generateFailedTestsMessage(selectedMachines, failedScriptResults)
      ) : (
        <Loader
          className="u-no-padding u-no-margin"
          inline
          text="Loading script results..."
        />
      )}
      <p>
        Overriding will allow the machines to be deployed, marked with a
        warning.
      </p>
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
        onCancel={() => setSelectedAction(null)}
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
        saving={saving}
        saved={saved}
        validationSchema={OverrideTestFormSchema}
      >
        <Row>
          <Col size="6">
            <FormikField
              label="Suppress test-failure icons in the machines list. Results remain visible in Machine > Hardware tests."
              name="suppressResults"
              type="checkbox"
            />
          </Col>
        </Row>
      </FormikForm>
    </>
  );
};

export default OverrideTestForm;
