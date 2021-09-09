import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import TagFormFields from "./TagFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { NodeActions } from "app/store/types/node";

type Props = {
  actionDisabled?: boolean;
  clearHeaderContent: ClearHeaderContent;
};

export type TagFormValues = {
  tags: string[];
};

const TagFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(Yup.string())
    .min(1)
    .required("You must select at least one tag."),
});

export const TagForm = ({
  actionDisabled,
  clearHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const [initialValues, setInitialValues] = useState<TagFormValues>({
    tags: [],
  });
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.TAG
  );

  let formErrors: Record<string, string | string[]> | null = null;
  if (errors && typeof errors === "object" && "name" in errors) {
    formErrors = {
      ...errors,
      tags: errors.name,
    } as Record<string, string | string[]>;
    delete formErrors.name;
  }

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm<TagFormValues>
      actionDisabled={actionDisabled}
      actionName={NodeActions.TAG}
      cleanup={machineActions.cleanup}
      clearHeaderContent={clearHeaderContent}
      errors={formErrors}
      initialValues={initialValues}
      loaded={tagsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Tag",
      }}
      onSubmit={(values) => {
        if (values.tags && values.tags.length) {
          machinesToAction.forEach((machine) => {
            dispatch(
              machineActions.tag({
                systemId: machine.system_id,
                tags: values.tags,
              })
            );
          });
        }
        setInitialValues(values);
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={TagFormSchema}
    >
      <TagFormFields />
    </ActionForm>
  );
};

export default TagForm;
