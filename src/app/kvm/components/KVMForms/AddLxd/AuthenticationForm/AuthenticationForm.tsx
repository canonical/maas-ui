import { useEffect, useState } from "react";

import { ExternalLink } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { AddLxdSteps } from "../AddLxd";
import type { AddLxdStepValues, NewPodValues } from "../types";

import AuthenticationFormFields from "./AuthenticationFormFields";

import FormikForm from "@/app/base/components/FormikForm";
import type { ClearSidePanelContent } from "@/app/base/types";
import { generalActions } from "@/app/store/general";
import { generatedCertificate as generatedCertificateSelectors } from "@/app/store/general/selectors";
import { podActions } from "@/app/store/pod";
import { PodType } from "@/app/store/pod/constants";
import podSelectors from "@/app/store/pod/selectors";
import type { RootState } from "@/app/store/root/types";

type Props = {
  clearSidePanelContent: ClearSidePanelContent;
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
  clearSidePanelContent,
  newPodValues,
  setNewPodValues,
  setStep,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const errors = useSelector(podSelectors.errors);
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, newPodValues.power_address)
  );
  const generatedCertificate = useSelector(generatedCertificateSelectors.get);
  const [useCertificate, setUseCertificate] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  // This form polls the server until the cert is trusted and hides the error
  // until it is succesful.
  const displayErrors =
    typeof errors !== "string" ||
    !errors.includes("Certificate is not trusted and no password was given");

  // User should revert back to the credentials step if attempt to authenticate
  // with password results in error.
  const shouldGoToCredentialsStep = !!errors && !useCertificate;
  useEffect(() => {
    if (shouldGoToCredentialsStep) {
      setStep(AddLxdSteps.CREDENTIALS);
    }
  }, [setStep, shouldGoToCredentialsStep]);

  // User is considered "authenticated" if projects exist in state for the given
  // LXD address, as projects can only be fetched using correct credentials.
  // Once "authenticated", they should be sent to the project selection step.
  const shouldGoToProjectStep = projects.length >= 1;
  useEffect(() => {
    if (shouldGoToProjectStep) {
      setStep(AddLxdSteps.SELECT_PROJECT);
    }
  }, [setStep, shouldGoToProjectStep]);

  // The generated certificate is cleared as we only store one in state at a
  // time. This will prepare the form for the next added KVM host. We also make
  // sure to stop polling the LXD server for projects.
  useEffect(() => {
    return () => {
      dispatch(generalActions.clearGeneratedCertificate());
      dispatch(podActions.pollLxdServerStop());
    };
  }, [dispatch]);

  return (
    <FormikForm<AuthenticationFormValues>
      allowAllEmpty
      aria-label="Authentication"
      buttonsHelp={
        useCertificate && authenticating ? (
          <Spinner
            data-testid="trust-confirmation-spinner"
            text="Waiting for LXD confirmation that trust is added."
          />
        ) : null
      }
      cancelDisabled={false}
      errors={displayErrors ? errors : null}
      initialValues={{
        password: "",
      }}
      onCancel={clearSidePanelContent}
      onSubmit={(values) => {
        dispatch(podActions.cleanup());
        setAuthenticating(true);
        const certificate = generatedCertificate?.certificate || "";
        const key = generatedCertificate?.private_key || "";
        if (useCertificate) {
          setNewPodValues({
            ...newPodValues,
            certificate,
            key,
          });
          dispatch(
            podActions.pollLxdServer({
              certificate,
              key,
              power_address: newPodValues.power_address,
            })
          );
        } else {
          setNewPodValues({ ...newPodValues, password: values.password });
          dispatch(
            podActions.getProjects({
              certificate,
              key,
              password: values.password,
              power_address: newPodValues.power_address,
              type: PodType.LXD,
            })
          );
        }
      }}
      saving={!useCertificate && authenticating}
      submitDisabled={useCertificate && authenticating}
      submitLabel="Check authentication"
      validationSchema={AuthenticationFormSchema}
    >
      <div>
        <div>
          <p>
            <strong>
              LXD host: {newPodValues.name} ({newPodValues.power_address})
            </strong>
          </p>
        </div>
        <div>
          <p>
            <ExternalLink to="https://discourse.maas.io/t/lxd-authentication/4856">
              How to trust a certificate in LXD
            </ExternalLink>
          </p>
        </div>
      </div>
      <hr />
      <p>
        <strong>This certificate is not trusted by LXD yet.</strong>
      </p>
      <AuthenticationFormFields
        disabled={authenticating}
        generatedCertificate={generatedCertificate}
        setUseCertificate={setUseCertificate}
        useCertificate={useCertificate}
      />
    </FormikForm>
  );
};

export default AuthenticationForm;
