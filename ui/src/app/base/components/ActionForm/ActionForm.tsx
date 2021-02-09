import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useProcessing } from "app/base/hooks";
import type { AnalyticsEvent, TSFixMe } from "app/base/types";
import { NodeActions } from "app/store/types/node";
import { formatErrors } from "app/utils";

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
    case NodeActions.ABORT:
      return `${processing ? "Aborting" : "Abort"} actions for ${modelString}`;
    case NodeActions.ACQUIRE:
      return `${processing ? "Acquiring" : "Acquire"} ${modelString}`;
    case NodeActions.COMMISSION:
      return `${
        processing ? "Starting" : "Start"
      } commissioning for ${modelString}`;
    case "compose":
      return `${processing ? "Composing" : "Compose"} ${modelString}`;
    case NodeActions.DELETE:
      return `${processing ? "Deleting" : "Delete"} ${modelString}`;
    case NodeActions.DEPLOY:
      return `${
        processing ? "Starting" : "Start"
      } deployment for ${modelString}`;
    case NodeActions.EXIT_RESCUE_MODE:
      return `${
        processing ? "Exiting" : "Exit"
      } rescue mode for ${modelString}`;
    case NodeActions.LOCK:
      return `${processing ? "Locking" : "Lock"} ${modelString}`;
    case NodeActions.ON:
      return `${processing ? "Powering" : "Power"} on ${modelString}`;
    case NodeActions.OFF:
      return `${processing ? "Powering" : "Power"} off ${modelString}`;
    case NodeActions.MARK_BROKEN:
      return `${processing ? "Marking" : "Mark"} ${modelString} broken`;
    case NodeActions.MARK_FIXED:
      return `${processing ? "Marking" : "Mark"} ${modelString} fixed`;
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return `${
        processing ? "Overriding" : "Override"
      } failed tests for ${modelString}`;
    case NodeActions.RELEASE:
      return `${processing ? "Releasing" : "Release"} ${modelString}`;
    case "refresh":
      return `${processing ? "Refreshing" : "Refresh"} ${modelString}`;
    case NodeActions.RESCUE_MODE:
      return `${
        processing ? "Entering" : "Enter"
      } rescue mode for ${modelString}`;
    case NodeActions.SET_POOL:
      return `${processing ? "Setting" : "Set"} pool for ${modelString}`;
    case NodeActions.SET_ZONE:
      return `${processing ? "Setting" : "Set"} zone for ${modelString}`;
    case NodeActions.TAG:
      return `${processing ? "Tagging" : "Tag"} ${modelString}`;
    case NodeActions.TEST:
      return `${processing ? "Starting" : "Start"} tests for ${modelString}`;
    case NodeActions.UNLOCK:
      return `${processing ? "Unlocking" : "Unlock"} ${modelString}`;
    default:
      return `${processing ? "Processing" : "Process"} ${modelString}`;
  }
};

type Props = {
  actionName?: string;
  allowUnchanged?: boolean;
  allowAllEmpty?: boolean;
  children?: ReactNode;
  cleanup?: () => void;
  clearSelectedAction?: (...args: unknown[]) => void;
  errors?: { [x: string]: TSFixMe } | null;
  initialValues?: { [x: string]: TSFixMe };
  loaded?: boolean;
  loading?: boolean;
  modelName: string;
  onSaveAnalytics?: AnalyticsEvent;
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
  allowAllEmpty = false,
  children,
  cleanup,
  clearSelectedAction,
  errors,
  initialValues = {},
  loaded = true,
  loading,
  modelName,
  onSaveAnalytics,
  onSubmit,
  onSuccess,
  processingCount,
  selectedCount,
  submitAppearance = "positive",
  validationSchema,
}: Props): JSX.Element => {
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);
  const formattedErrors = formatErrors(errors);

  useProcessing(
    processingCount,
    () => {
      setProcessing(false);
      setSaved(true);
      onSuccess && onSuccess();
    },
    errors && Object.keys(errors).length > 0,
    () => setProcessing(false)
  );

  // Clearing the selected action is moved into its own effect so that `saved`
  // can be set before the component unmounts. This triggers analytics being sent.
  useEffect(() => {
    if (saved && clearSelectedAction) {
      clearSelectedAction();
    }
  }, [clearSelectedAction, saved]);

  if (loaded) {
    return (
      <FormikForm
        allowUnchanged={allowUnchanged}
        allowAllEmpty={allowAllEmpty}
        buttons={FormCardButtons}
        buttonsBordered={false}
        cleanup={cleanup}
        errors={formattedErrors}
        initialValues={initialValues}
        loading={loading}
        onCancel={clearSelectedAction}
        onSaveAnalytics={onSaveAnalytics}
        onSubmit={(...args: unknown[]) => {
          onSubmit(...args);
          setProcessing(true);
        }}
        saved={saved}
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
  }
  return (
    <Strip>
      <Spinner text="Loading..." />
    </Strip>
  );
};

export default ActionForm;
