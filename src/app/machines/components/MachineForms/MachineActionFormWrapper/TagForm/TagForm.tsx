import { useState } from "react";

import { NotificationSeverity } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import TagFormFields from "./TagFormFields";
import type { TagFormValues } from "./types";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { selectedToFilters } from "app/store/machine/utils";
import { useSelectedMachinesActionsDispatch } from "app/store/machine/utils/hooks";
import { actions as messageActions } from "app/store/message";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import { NodeActions } from "app/store/types/node";

type Props = MachineActionFormProps & {
  viewingMachineConfig?: boolean;
};

export enum Label {
  Saved = "Saved all tag changes.",
}

const TagFormSchema = Yup.object().shape({
  added: Yup.array().of(Yup.string()),
  removed: Yup.array().of(Yup.string()),
});

export const TagForm = ({
  clearSidePanelContent,
  errors,
  machines,
  processingCount,
  searchFilter,
  selectedCount,
  selectedMachines,
  viewingDetails,
  viewingMachineConfig = false,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const [newTags, setNewTags] = useState<Tag[TagMeta.PK][]>([]);
  const filter = selectedToFilters(selectedMachines || null);

  let formErrors: Record<string, string | string[]> | null = null;
  if (errors && typeof errors === "object" && "name" in errors) {
    formErrors = {
      ...errors,
      added: errors.name,
    } as Record<string, string | string[]>;
    delete formErrors.name;
  }

  return (
    <ActionForm<TagFormValues, MachineEventErrors>
      actionName={NodeActions.TAG}
      cleanup={machineActions.cleanup}
      errors={formErrors || errors}
      initialValues={{
        added: [],
        removed: [],
      }}
      loaded={tagsLoaded}
      modelName="machine"
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Tag",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        if (values.added.length) {
          if (filter) {
            dispatchForSelectedMachines(machineActions.tag, {
              tags: values.added.map((id) => Number(id)),
            });
          } else {
            machines?.forEach((machine) => {
              dispatch(
                machineActions.tag({
                  system_id: machine.system_id,
                  tags: values.added.map((id) => Number(id)),
                })
              );
            });
          }
        }
        if (values.removed.length) {
          if (selectedMachines) {
            dispatchForSelectedMachines(machineActions.untag, {
              tags: values.removed.map((id) => Number(id)),
            });
          } else {
            machines?.forEach((machine) => {
              dispatch(
                machineActions.untag({
                  system_id: machine.system_id,
                  tags: values.removed.map((id) => Number(id)),
                })
              );
            });
          }
        }
      }}
      onSuccess={() => {
        clearSidePanelContent();
        dispatch(
          messageActions.add(Label.Saved, NotificationSeverity.POSITIVE)
        );
      }}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : selectedCount ?? 0}
      showProcessingCount={!viewingMachineConfig}
      submitLabel="Save"
      validationSchema={TagFormSchema}
      {...actionProps}
    >
      <TagFormFields
        machines={machines || []}
        newTags={newTags}
        searchFilter={searchFilter}
        selectedCount={selectedCount}
        selectedMachines={selectedMachines}
        setNewTags={setNewTags}
        viewingDetails={viewingDetails}
        viewingMachineConfig={viewingMachineConfig}
      />
    </ActionForm>
  );
};

export default TagForm;
