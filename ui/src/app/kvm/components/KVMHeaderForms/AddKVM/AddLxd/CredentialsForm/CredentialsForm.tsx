import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { SetKvmType } from "../../AddKVM";
import { AddLxdSteps } from "../AddLxd";
import type {
  AddLxdStepValues,
  CredentialsFormValues,
  NewPodValues,
} from "../types";

import CredentialsFormFields from "./CredentialsFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import { generatedCertificate as generatedCertificateSelectors } from "app/store/general/selectors";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { splitCertificateName } from "app/utils";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  newPodValues: NewPodValues;
  setKvmType: SetKvmType;
  setNewPodValues: (values: NewPodValues) => void;
  setStep: (step: AddLxdStepValues) => void;
};

export const CredentialsForm = ({
  clearHeaderContent,
  newPodValues,
  setKvmType,
  setNewPodValues,
  setStep,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, newPodValues.power_address)
  );
  const generatedCertificate = useSelector(generatedCertificateSelectors.get);
  const generatingCertificate = useSelector(
    generatedCertificateSelectors.loading
  );
  const errors = useSelector(podSelectors.errors);
  const [authenticating, setAuthenticating] = useState(false);
  const [shouldGenerateCert, setShouldGenerateCert] = useState(true);

  useEffect(() => {
    if (!!errors) {
      setAuthenticating(false);
    }
  }, [errors]);

  // Once a generated certificate for the new pod exists in state, the user
  // should be sent to the auth trust step.
  const splitCertName = splitCertificateName(generatedCertificate);
  const shouldGoToAuthStep =
    !errors && splitCertName?.name === newPodValues.name;
  useEffect(() => {
    if (shouldGoToAuthStep) {
      setStep(AddLxdSteps.AUTHENTICATION);
    }
  }, [setStep, shouldGoToAuthStep]);

  // User is considered "authenticated" if they have set a LXD server address
  // and projects for it exist in state. Once "authenticated", they should
  // be sent to the project selection step.
  const shouldGoToProjectStep =
    !errors && !!newPodValues.power_address && projects.length >= 1;
  useEffect(() => {
    if (shouldGoToProjectStep) {
      setStep(AddLxdSteps.SELECT_PROJECT);
    }
  }, [setStep, shouldGoToProjectStep]);

  const CredentialsFormSchema = Yup.object()
    .shape({
      certificate: shouldGenerateCert
        ? Yup.string()
        : Yup.string().required("Certificate is required"),
      key: shouldGenerateCert
        ? Yup.string()
        : Yup.string().required("Private key is required"),
      name: Yup.string().required("Name is required"),
      pool: Yup.string().required("Resource pool required"),
      power_address: Yup.string().required("Address is required"),
      zone: Yup.string().required("Zone required"),
    })
    .defined();

  return (
    <FormikForm<CredentialsFormValues>
      allowUnchanged={!!newPodValues.power_address}
      enableReinitialize
      errors={errors}
      initialValues={{
        certificate: newPodValues.certificate,
        key: newPodValues.key,
        name: newPodValues.name,
        pool: newPodValues.pool,
        power_address: newPodValues.power_address,
        zone: newPodValues.zone,
      }}
      onCancel={clearHeaderContent}
      onSubmit={(values) => {
        dispatch(podActions.cleanup());
        setNewPodValues({ ...values, password: "" });
        if (shouldGenerateCert) {
          dispatch(
            generalActions.generateCertificate({
              object_name: values.name,
            })
          );
        } else {
          setAuthenticating(true);
          dispatch(
            podActions.getProjects({
              certificate: values.certificate,
              key: values.key,
              power_address: values.power_address,
              type: PodType.LXD,
            })
          );
        }
      }}
      saving={authenticating || generatingCertificate}
      submitLabel="Next"
      validationSchema={CredentialsFormSchema}
    >
      <CredentialsFormFields
        setKvmType={setKvmType}
        setShouldGenerateCert={setShouldGenerateCert}
        shouldGenerateCert={shouldGenerateCert}
      />
    </FormikForm>
  );
};

export default CredentialsForm;
