import { useEffect, useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";

import type { FormikFormProps } from "app/base/components/FormikForm";
import FormikForm from "app/base/components/FormikForm";
import { useProcessing } from "app/base/hooks";
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
    case "remove":
      return `${processing ? "Removing" : "Remove"} ${modelString}`;
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

export type Props<V> = FormikFormProps<V> & {
  actionDisabled?: boolean;
  actionName?: string;
  clearSelectedAction?: (...args: unknown[]) => void;
  loaded?: boolean;
  modelName: string;
  onSuccess?: () => void;
  processingCount?: number;
  selectedCount?: number;
};

const ActionForm = <V,>({
  actionDisabled,
  actionName,
  children,
  clearSelectedAction,
  errors,
  loaded = true,
  modelName,
  onSubmit,
  onSuccess,
  processingCount,
  selectedCount,
  ...formikFormProps
}: Props<V>): JSX.Element | null => {
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedOnSubmit, setSelectedOnSubmit] = useState(selectedCount);
  const formattedErrors = formatErrors(errors);

  useProcessing(
    processingCount,
    () => {
      setProcessing(false);
      setSaved(true);
      onSuccess && onSuccess();
    },
    Boolean(formattedErrors),
    () => setProcessing(false)
  );

  // Clearing the selected action is moved into its own effect so that `saved`
  // can be set before the component unmounts. This triggers analytics being sent.
  useEffect(() => {
    if (saved && clearSelectedAction) {
      clearSelectedAction();
    }
  }, [clearSelectedAction, saved]);

  // Don't display the form when the action is disabled, an update selection
  // notification is show instead. However, we do still need to render this
  // component so that the clearSelectedAction useEffect can still run when the
  // action completes.
  if (actionDisabled) {
    return null;
  }

  if (loaded) {
    return (
      <FormikForm<V>
        buttonsAlign="right"
        buttonsBordered={false}
        errors={formattedErrors}
        onCancel={clearSelectedAction}
        onSubmit={(values?, formikHelpers?) => {
          onSubmit(values, formikHelpers);
          // Set selected count in component state once form is submitted, so
          // that the saving label is not affected by updates to the component's
          // selectedCount prop, e.g. unselecting or deleting items.
          setSelectedOnSubmit(selectedCount);
          setProcessing(true);
        }}
        saving={processing}
        savingLabel={`${getLabel(
          modelName,
          actionName,
          selectedOnSubmit,
          processingCount
        )}...`}
        submitLabel={getLabel(modelName, actionName, selectedCount)}
        {...formikFormProps}
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
