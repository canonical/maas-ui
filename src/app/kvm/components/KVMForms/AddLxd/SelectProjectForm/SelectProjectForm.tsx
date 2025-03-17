import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import { AddLxdSteps } from "../AddLxd";
import type {
  AddLxdStepValues,
  NewPodValues,
  SelectProjectFormValues,
} from "../types";

import SelectProjectFormFields from "./SelectProjectFormFields";

import FormikForm from "@/app/base/components/FormikForm";
import { useAddMessage } from "@/app/base/hooks";
import type { ClearSidePanelContent } from "@/app/base/types";
import { podActions } from "@/app/store/pod";
import { PodType } from "@/app/store/pod/constants";
import podSelectors from "@/app/store/pod/selectors";
import type { RootState } from "@/app/store/root/types";
import { formatErrors, preparePayload } from "@/app/utils";

type Props = {
  clearSidePanelContent: ClearSidePanelContent;
  newPodValues: NewPodValues;
  setStep: (step: AddLxdStepValues) => void;
  setSubmissionErrors: (submissionErrors: string | null) => void;
};

export const SelectProjectForm = ({
  clearSidePanelContent,
  newPodValues,
  setStep,
  setSubmissionErrors,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const errors = useSelector(podSelectors.errors);
  const saved = useSelector(podSelectors.saved);
  const saving = useSelector(podSelectors.saving);
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, newPodValues.power_address)
  );
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const [savingPod, setSavingPod] = useState<string | null>(null);
  const SelectProjectSchema: SchemaOf<SelectProjectFormValues> = Yup.object()
    .shape({
      existingProject: Yup.string(),
      newProject: Yup.string()
        .max(63, "Must be less than 63 characters")
        .matches(
          /^[a-zA-Z0-9-_]*$/,
          `Must not contain any spaces or special characters (i.e. / . ' " *)`
        )
        .test(
          "alreadyExists",
          "A project with this name already exists",
          function test() {
            const values: SelectProjectFormValues = this.parent;
            const projectExists = projects.some(
              (project) => project.name === values.newProject
            );
            if (projectExists) {
              return this.createError({
                message: "A project with this name already exists.",
                path: "newProject",
              });
            }
            return true;
          }
        ),
    })
    .defined();

  // Revert to the credentials step if any errors occur when creating pod.
  useEffect(() => {
    if (!!errors) {
      dispatch(podActions.clearProjects());
      setSubmissionErrors(formatErrors(errors));
      setStep(AddLxdSteps.CREDENTIALS);
    }
  }, [dispatch, errors, setStep, setSubmissionErrors]);

  useEffect(() => {
    return () => {
      dispatch(podActions.clearProjects());
      dispatch(cleanup());
    };
  }, [dispatch, cleanup]);

  useAddMessage(
    saved,
    cleanup,
    `${savingPod} added successfully.`,
    clearSidePanelContent
  );

  return (
    <FormikForm<SelectProjectFormValues>
      aria-label="Project selection"
      initialValues={{
        existingProject: "",
        newProject: "",
      }}
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Save LXD KVM",
        category: "Add KVM form",
        label: "Save KVM",
      }}
      onSubmit={(values) => {
        dispatch(cleanup());
        const params = preparePayload({
          certificate: newPodValues.certificate,
          key: newPodValues.key,
          name: newPodValues.name,
          password: newPodValues.password,
          pool: Number(newPodValues.pool),
          power_address: newPodValues.power_address,
          project: values.newProject || values.existingProject,
          type: PodType.LXD,
          zone: Number(newPodValues.zone),
        });
        dispatch(podActions.create(params));
        setSavingPod(newPodValues.name || "LXD KVM host");
      }}
      saved={saved}
      saving={saving}
      submitLabel="Save LXD host"
      validationSchema={SelectProjectSchema}
    >
      <SelectProjectFormFields newPodValues={newPodValues} />
    </FormikForm>
  );
};

export default SelectProjectForm;
