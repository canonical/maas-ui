import { useEffect, useState } from "react";

import { Link, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { AddLxdSteps } from "../AddLxd";
import type { AddLxdStepValues, NewPodValues } from "../types";

import AuthenticationFormFields from "./AuthenticationFormFields";

import FormikForm from "app/base/components/FormikForm";
import { useCycled } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  newPodValues: NewPodValues;
  setNewPodValues: (podValues: NewPodValues) => void;
  setStep: (step: AddLxdStepValues) => void;
};

export type AuthenticationFormValues = {
  password: string;
};

const AuthenticationFormSchema = Yup.object().shape({
  password: Yup.string(),
});

export const AuthenticationForm = ({
  clearHeaderContent,
  newPodValues,
  setNewPodValues,
  setStep,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(podSelectors.errors);
  const [useCertificate, setUseCertificate] = useState(true);
  const [usingPassword, setUsingPassword] = useState(false);
  const hasTriedUsingPassword = useCycled(!usingPassword);

  // Revert to the credentials step if get project action fails with password.
  useEffect(() => {
    if (hasTriedUsingPassword && !!errors) {
      setStep(AddLxdSteps.CREDENTIALS);
    }
  }, [errors, hasTriedUsingPassword, setStep]);

  return (
    <FormikForm<AuthenticationFormValues>
      allowAllEmpty
      buttonsHelp={
        useCertificate ? (
          <Spinner
            data-test="trust-confirmation-spinner"
            text="Waiting for LXD confirmation that trust is added."
          />
        ) : null
      }
      initialValues={{
        password: "",
      }}
      onCancel={clearHeaderContent}
      onSubmit={(values) => {
        if (!useCertificate) {
          setUsingPassword(true);
          setNewPodValues({ ...newPodValues, password: values.password });
          dispatch(
            podActions.getProjects({
              password: values.password,
              power_address: newPodValues.power_address,
              type: PodType.LXD,
            })
          );
        }
      }}
      saving={usingPassword}
      submitDisabled={useCertificate}
      submitLabel="Next"
      validationSchema={AuthenticationFormSchema}
    >
      <div className="u-flex--between">
        <div>
          <p>
            LXD host:{" "}
            {newPodValues.name && <strong>{newPodValues.name}</strong>} (
            {newPodValues.power_address})
          </p>
        </div>
        <div>
          <p>
            <Link
              href="https://discourse.maas.io/t/lxd-authentication/4856"
              rel="noopener noreferrer"
              target="_blank"
            >
              How to trust a certificate in LXD
            </Link>
          </p>
        </div>
      </div>
      <hr />
      <p>
        <strong>This certificate is not trusted by LXD yet.</strong>
      </p>
      <AuthenticationFormFields
        setUseCertificate={setUseCertificate}
        useCertificate={useCertificate}
      />
    </FormikForm>
  );
};

export default AuthenticationForm;
