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
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";

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
  const errors = useSelector(podSelectors.errors);
  const [authenticating, setAuthenticating] = useState(false);
  const [generateCert, setGenerateCert] = useState(true);

  useEffect(() => {
    if (!!errors) {
      setAuthenticating(false);
    }
  }, [errors]);

  const CredentialsFormSchema = Yup.object()
    .shape({
      certificate: generateCert
        ? Yup.string()
        : Yup.string().required("Certificate is required"),
      key: generateCert
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
        if (generateCert) {
          // TODO: Add ability to generate certificate from UI
          // https://github.com/canonical-web-and-design/app-squad/issues/257
          setStep(AddLxdSteps.AUTHENTICATION);
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
      saving={authenticating}
      submitLabel="Next"
      validationSchema={CredentialsFormSchema}
    >
      <CredentialsFormFields
        generateCert={generateCert}
        setGenerateCert={setGenerateCert}
        setKvmType={setKvmType}
      />
    </FormikForm>
  );
};

export default CredentialsForm;
