import { useCallback, useEffect, useState } from "react";

import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { AddLxdSteps } from "../AddLxd";
import type {
  AddLxdStepValues,
  CredentialsFormValues,
  NewPodValues,
} from "../types";

import CredentialsFormFields from "./CredentialsFormFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { ClearHeaderContent } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import { generatedCertificate as generatedCertificateSelectors } from "app/store/general/selectors";
import { splitCertificateName } from "app/store/general/utils";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  newPodValues: NewPodValues;
  setNewPodValues: (values: NewPodValues) => void;
  setStep: (step: AddLxdStepValues) => void;
  setSubmissionErrors: (submissionErrors: string | null) => void;
};

export const CredentialsForm = ({
  clearHeaderContent,
  newPodValues,
  setNewPodValues,
  setStep,
  setSubmissionErrors,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, newPodValues.power_address)
  );
  const generatedCertificate = useSelector(generatedCertificateSelectors.get);
  const generatingCertificate = useSelector(
    generatedCertificateSelectors.loading
  );
  const podErrors = useSelector(podSelectors.errors);
  const generatedCertificateErrors = useSelector(
    generatedCertificateSelectors.errors
  );
  const [authenticating, setAuthenticating] = useState(false);
  const [shouldGenerateCert, setShouldGenerateCert] = useState(true);
  const errors = podErrors || generatedCertificateErrors;
  const cleanup = useCallback(() => {
    dispatch(generalActions.cleanupGeneratedCertificateErrors());
    return podActions.cleanup();
  }, [dispatch]);

  useEffect(() => {
    if (!!errors) {
      setAuthenticating(false);
    }
  }, [errors]);

  // Once a generated certificate for the new pod exists in state, the user
  // should be sent to the auth trust step.
  const splitCertName = splitCertificateName(generatedCertificate?.CN || null);
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

  useEffect(
    () => () => {
      setSubmissionErrors(null);
    },
    [setSubmissionErrors]
  );

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
    <Formik
      enableReinitialize
      initialValues={{
        certificate: newPodValues.certificate,
        key: newPodValues.key,
        name: newPodValues.name,
        pool: newPodValues.pool,
        power_address: newPodValues.power_address,
        zone: newPodValues.zone,
      }}
      onSubmit={(values) => {
        cleanup();
        setSubmissionErrors(null);
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
      validationSchema={CredentialsFormSchema}
    >
      <FormikFormContent<CredentialsFormValues>
        allowUnchanged={!!newPodValues.power_address}
        errors={errors}
        cleanup={cleanup}
        onCancel={clearHeaderContent}
        saving={authenticating || generatingCertificate}
        submitLabel="Next"
      >
        <CredentialsFormFields
          setShouldGenerateCert={setShouldGenerateCert}
          shouldGenerateCert={shouldGenerateCert}
        />
      </FormikFormContent>
    </Formik>
  );
};

export default CredentialsForm;
