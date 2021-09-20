import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import UpdateCertificateFields from "./UpdateCertificateFields";

import FormikForm from "app/base/components/FormikForm";
import { actions as generalActions } from "app/store/general";
import { generatedCertificate as generatedCertificateSelectors } from "app/store/general/selectors";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { PodDetails } from "app/store/pod/types";

type Props = {
  closeForm: () => void;
  pod: PodDetails;
  showCancel: boolean;
};

export type UpdateCertificateValues = {
  certificate: string;
  key: string;
  password: string;
};

const UpdateCertificate = ({
  closeForm,
  pod,
  showCancel,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const generatedCertificate = useSelector(generatedCertificateSelectors.get);
  const generatingCertificate = useSelector(
    generatedCertificateSelectors.loading
  );
  const podErrors = useSelector(podSelectors.errors);
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const [shouldGenerateCert, setShouldGenerateCert] = useState(true);

  useEffect(() => {
    return () => {
      dispatch(generalActions.clearGeneratedCertificate());
      dispatch(podActions.cleanup());
    };
  }, [dispatch]);

  const UpdateCertificateSchema = Yup.object().shape({
    certificate: shouldGenerateCert
      ? Yup.string()
      : Yup.string().required("Certificate is required"),
    key: shouldGenerateCert
      ? Yup.string()
      : Yup.string().required("Private key is required"),
    password: Yup.string(),
  });

  return (
    <FormikForm<UpdateCertificateValues>
      allowAllEmpty={shouldGenerateCert}
      allowUnchanged={shouldGenerateCert}
      errors={podErrors}
      initialValues={{ certificate: "", key: "", password: "" }}
      onCancel={showCancel ? closeForm : null}
      onSubmit={(values) => {
        if (generatedCertificate) {
          dispatch(
            podActions.update({
              certificate: generatedCertificate.certificate,
              id: pod.id,
              key: generatedCertificate.private_key,
              password: values.password,
              tags: pod.tags.join(","),
            })
          );
        } else if (shouldGenerateCert) {
          dispatch(
            generalActions.generateCertificate({ object_name: pod.name })
          );
        } else {
          dispatch(
            podActions.update({
              certificate: values.certificate,
              id: pod.id,
              key: values.key,
              tags: pod.tags.join(","),
            })
          );
        }
      }}
      onSuccess={closeForm}
      saved={podSaved}
      saving={generatingCertificate || podSaving}
      submitLabel={
        shouldGenerateCert && !generatedCertificate ? "Next" : "Save"
      }
      validationSchema={UpdateCertificateSchema}
    >
      <UpdateCertificateFields
        generatedCertificate={generatedCertificate}
        shouldGenerateCert={shouldGenerateCert}
        setShouldGenerateCert={setShouldGenerateCert}
      />
    </FormikForm>
  );
};

export default UpdateCertificate;
