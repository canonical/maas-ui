import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { SetKvmType } from "../../AddKVM";
import type { CredentialsFormValues, NewPodValues } from "../types";

import CredentialsFormFields from "./CredentialsFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import { generatedCertificate as generatedCertificateSelectors } from "app/store/general/selectors";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  newPodValues: NewPodValues;
  setKvmType: SetKvmType;
  setNewPodValues: (values: NewPodValues) => void;
};

export const CredentialsForm = ({
  clearHeaderContent,
  newPodValues,
  setKvmType,
  setNewPodValues,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
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
