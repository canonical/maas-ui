import React, { useState } from "react";

import { useProcessing } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import { formatErrors } from "app/utils";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";

const getLabel = (
  modelName: string,
  actionName?: string,
  selectedCount?: number,
  processingCount?: number
) => {
  const processing = processingCount >= 0;

  // e.g. "machine""
  let modelString = modelName;
  if (processing && selectedCount > 1) {
    // e.g.  "1 of 2 machines"
    modelString = `${
      selectedCount - processingCount
    } of ${selectedCount} ${modelName}s`;
  } else if (selectedCount > 1) {
    // e.g. "2 machines"
    modelString = `${selectedCount} ${modelName}s`;
  }

  switch (actionName) {
    case "abort":
      return `${processing ? "Aborting" : "Abort"} actions for ${modelString}`;
    case "acquire":
      return `${processing ? "Acquiring" : "Acquire"} ${modelString}`;
    case "commission":
      return `${
        processing ? "Starting" : "Start"
      } commissioning for ${modelString}`;
    case "compose":
      return `${processing ? "Composing" : "Compose"} ${modelString}`;
    case "delete":
      return `${processing ? "Deleting" : "Delete"} ${modelString}`;
    case "deploy":
      return `${
        processing ? "Starting" : "Start"
      } deployment for ${modelString}`;
    case "exit-rescue-mode":
      return `${
        processing ? "Exiting" : "Exit"
      } rescue mode for ${modelString}`;
    case "lock":
      return `${processing ? "Locking" : "Lock"} ${modelString}`;
    case "on":
      return `${processing ? "Powering" : "Power"} on ${modelString}`;
    case "off":
      return `${processing ? "Powering" : "Power"} off ${modelString}`;
    case "mark-broken":
      return `${processing ? "Marking" : "Mark"} ${modelString} broken`;
    case "mark-fixed":
      return `${processing ? "Marking" : "Mark"} ${modelString} fixed`;
    case "override-failed-testing":
      return `${
        processing ? "Overriding" : "Override"
      } failed tests for ${modelString}`;
    case "release":
      return `${processing ? "Releasing" : "Release"} ${modelString}`;
    case "refresh":
      return `${processing ? "Refreshing" : "Refresh"} ${modelString}`;
    case "rescue-mode":
      return `${
        processing ? "Entering" : "Enter"
      } rescue mode for ${modelString}`;
    case "set-pool":
      return `${processing ? "Setting" : "Set"} pool for ${modelString}`;
    case "set-zone":
      return `${processing ? "Setting" : "Set"} zone for ${modelString}`;
    case "tag":
      return `${processing ? "Tagging" : "Tag"} ${modelString}`;
    case "test":
      return `${processing ? "Starting" : "Start"} tests for ${modelString}`;
    case "unlock":
      return `${processing ? "Unlocking" : "Unlock"} ${modelString}`;
    default:
      return `${processing ? "Processing" : "Process"} ${modelString}`;
  }
};

type Props = {
  actionName?: string;
  allowUnchanged?: boolean;
  children?: JSX.Element;
  cleanup?: () => void;
  clearSelectedAction?: (...args: unknown[]) => void;
  disabled?: boolean;
  errors?: { [x: string]: TSFixMe };
  initialValues?: { [x: string]: TSFixMe };
  loading?: boolean;
  modelName: string;
  onSubmit: (...args: unknown[]) => void;
  onSuccess?: () => void;
  processingCount?: number;
  selectedCount?: number;
  submitAppearance?: string;
  validationSchema?: TSFixMe;
};

const ActionForm = ({
  actionName,
  allowUnchanged = false,
  children,
  cleanup,
  clearSelectedAction,
  disabled,
  errors = {},
  initialValues = {},
  loading,
  modelName,
  onSubmit,
  onSuccess,
  processingCount,
  selectedCount,
  submitAppearance = "positive",
  validationSchema,
}: Props): JSX.Element => {
  const [processing, setProcessing] = useState(false);
  const formattedErrors = formatErrors(errors);

  useProcessing(
    processingCount,
    () => {
      setProcessing(false);
      onSuccess && onSuccess();
      clearSelectedAction && clearSelectedAction();
    },
    Object.keys(errors).length > 0,
    () => setProcessing(false)
  );

  return (
    <FormikForm
      allowUnchanged={allowUnchanged}
      buttons={FormCardButtons}
      buttonsBordered={false}
      cleanup={cleanup}
      disabled={disabled}
      errors={formattedErrors}
      initialValues={initialValues}
      loading={loading}
      onCancel={clearSelectedAction}
      onSaveAnalytics={{
        action: actionName,
        category: "Take action form",
        label: getLabel(modelName, actionName),
      }}
      onSubmit={(...args) => {
        onSubmit(...args);
        setProcessing(true);
      }}
      saving={processing}
      savingLabel={`${getLabel(
        modelName,
        actionName,
        selectedCount,
        processingCount
      )}...`}
      submitAppearance={submitAppearance}
      submitLabel={getLabel(modelName, actionName, selectedCount)}
      validationSchema={validationSchema}
    >
      {children}
    </FormikForm>
  );
};

export default ActionForm;
