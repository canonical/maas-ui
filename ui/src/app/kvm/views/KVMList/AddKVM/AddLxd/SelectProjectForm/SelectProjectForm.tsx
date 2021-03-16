import { useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import type { AuthenticateFormValues } from "../AddLxd";

import SelectProjectFormFields from "./SelectProjectFormFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage } from "app/base/hooks";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  authValues: AuthenticateFormValues;
};

export type SelectProjectFormValues = {
  existingProject: string;
  newProject: string;
};

export const SelectProjectForm = ({ authValues }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector(podSelectors.errors);
  const saved = useSelector(podSelectors.saved);
  const saving = useSelector(podSelectors.saving);
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, authValues.power_address)
  );
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const [savingPod, setSavingPod] = useState("");

  useAddMessage(saved, cleanup, `${savingPod} added successfully.`, () =>
    setSavingPod("")
  );

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

  return (
    <FormikForm<SelectProjectFormValues>
      buttons={FormCardButtons}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        existingProject: "",
        newProject: "",
      }}
      onCancel={() => history.push({ pathname: "/kvm" })}
      onSaveAnalytics={{
        action: "Save LXD KVM",
        category: "Add KVM form",
        label: "Save KVM",
      }}
      onSubmit={(values: SelectProjectFormValues) => {
        dispatch(cleanup());
        const params = {
          name: authValues.name,
          password: authValues.password,
          pool: Number(authValues.pool),
          power_address: authValues.power_address,
          project: values.newProject || values.existingProject,
          type: PodType.LXD,
          zone: Number(authValues.zone),
        };
        dispatch(podActions.create(params));
        setSavingPod(authValues.name || "LXD VM host");
      }}
      saved={saved}
      savedRedirect="/kvm"
      saving={saving}
      submitLabel="Save KVM"
      validationSchema={SelectProjectSchema}
    >
      <SelectProjectFormFields authValues={authValues} />
    </FormikForm>
  );
};

export default SelectProjectForm;
