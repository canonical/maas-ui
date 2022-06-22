import { useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";

import type { FormikFormProps } from "app/base/components/FormikForm";
import FormikForm from "app/base/components/FormikForm";
import { useProcessing } from "app/base/hooks";
import { getNodeActionLabel } from "app/store/utils";

const getLabel = (
  modelName: string,
  actionName: string,
  selectedCount: number,
  processingCount?: number
) => {
  const processing =
    typeof processingCount === "number" && processingCount >= 0;

  // e.g. "machine"
  let modelString = modelName;
  if (processing && selectedCount > 1) {
    // e.g.  "1 of 2 machines"
    modelString = `${
      selectedCount - (processingCount || 0)
    } of ${selectedCount} ${modelName}s`;
  } else if (selectedCount > 1) {
    // e.g. "2 machines"
    modelString = `${selectedCount} ${modelName}s`;
  }
  return getNodeActionLabel(modelString, actionName, processing);
};

export type Props<V, E = null> = Omit<
  FormikFormProps<V, E>,
  "buttonsAlign" | "saved" | "saving" | "savingLabel" | "submitLabel"
> & {
  actionName: string;
  loaded?: boolean;
  modelName: string;
  processingCount: number;
  selectedCount: number;
  showProcessingCount?: boolean;
  submitLabel?: string;
};

export enum Labels {
  LoadingForm = "Loading form",
}

const ActionForm = <V, E = null>({
  actionName,
  buttonsBordered = false,
  children,
  errors,
  loaded = true,
  modelName,
  onSubmit,
  processingCount,
  selectedCount,
  showProcessingCount = true,
  submitLabel,
  ...formikFormProps
}: Props<V, E>): JSX.Element | null => {
  const [selectedOnSubmit, setSelectedOnSubmit] = useState(selectedCount);
  const processingComplete = useProcessing({
    hasErrors: !!errors,
    processingCount,
  });

  if (!loaded) {
    return (
      <Strip>
        <Spinner aria-label={Labels.LoadingForm} text="Loading..." />
      </Strip>
    );
  }

  return (
    <FormikForm<V, E>
      buttonsAlign="right"
      buttonsBordered={buttonsBordered}
      errors={errors}
      onSubmit={(values?, formikHelpers?) => {
        onSubmit(values, formikHelpers);
        // Set selected count in component state once form is submitted, so
        // that the saving label is not affected by updates to the component's
        // selectedCount prop, e.g. unselecting or deleting items.
        setSelectedOnSubmit(selectedCount);
      }}
      saved={processingComplete}
      saving={processingCount > 0}
      savingLabel={
        showProcessingCount
          ? `${getLabel(
              modelName,
              actionName,
              selectedOnSubmit,
              processingCount
            )}...`
          : null
      }
      submitLabel={
        submitLabel ?? getLabel(modelName, actionName, selectedCount)
      }
      {...formikFormProps}
    >
      {children}
    </FormikForm>
  );
};

export default ActionForm;
