import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { SetKvmType } from "../AddKVM";

import AuthenticationForm from "./AuthenticationForm";
import CredentialsForm from "./CredentialsForm";
import SelectProjectForm from "./SelectProjectForm";
import type { AddLxdStepValues, NewPodValues } from "./types";

import Stepper from "app/base/components/Stepper";
import type { ClearHeaderContent } from "app/base/types";
import { generatedCertificate as generatedCertificateSelectors } from "app/store/general/selectors";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  setKvmType: SetKvmType;
};

export const AddLxdSteps = {
  AUTHENTICATION: "authentication",
  CREDENTIALS: "credentials",
  SELECT_PROJECT: "selectProject",
} as const;

export const AddLxd = ({
  clearHeaderContent,
  setKvmType,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const generatedCertificate = useSelector(generatedCertificateSelectors.get);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const [step, setStep] = useState<AddLxdStepValues>("credentials");
  const [newPodValues, setNewPodValues] = useState<NewPodValues>({
    certificate: "",
    key: "",
    name: "",
    password: "",
    pool: resourcePools.length ? `${resourcePools[0].id}` : "",
    power_address: "",
    zone: zones.length ? `${zones[0].id}` : "",
  });
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, newPodValues.power_address)
  );

  // Once a generated certificate for the new pod exists in state, the user
  // should be sent to the auth trust step.
  const shouldGoToAuthStep = !!(
    generatedCertificate?.CN.includes(newPodValues.name) &&
    step === AddLxdSteps.CREDENTIALS
  );
  useEffect(() => {
    if (shouldGoToAuthStep) {
      setStep(AddLxdSteps.AUTHENTICATION);
    }
  }, [shouldGoToAuthStep]);

  // User is considered "authenticated" if they have set a LXD server address
  // and projects for it exist in state. Once "authenticated", they should
  // be sent to the project selection step.
  const shouldGoToProjectStep = !!(
    newPodValues.power_address &&
    projects.length >= 1 &&
    step !== AddLxdSteps.SELECT_PROJECT
  );
  useEffect(() => {
    if (shouldGoToProjectStep) {
      setStep(AddLxdSteps.SELECT_PROJECT);
    }
  }, [shouldGoToProjectStep]);

  // We run the cleanup function here rather than in each form component
  // because we want the errors to be able to persist across forms.
  useEffect(() => {
    return () => {
      dispatch(podActions.cleanup());
    };
  }, [dispatch]);

  return (
    <>
      <Stepper
        items={[
          { step: AddLxdSteps.CREDENTIALS, title: "Credentials" },
          { step: AddLxdSteps.AUTHENTICATION, title: "Authentication" },
          { step: AddLxdSteps.SELECT_PROJECT, title: "Project selection" },
        ]}
        currentStep={step}
      />
      <hr />
      {step === AddLxdSteps.CREDENTIALS && (
        <CredentialsForm
          clearHeaderContent={clearHeaderContent}
          newPodValues={newPodValues}
          setKvmType={setKvmType}
          setNewPodValues={setNewPodValues}
        />
      )}
      {step === AddLxdSteps.AUTHENTICATION && (
        <AuthenticationForm
          clearHeaderContent={clearHeaderContent}
          newPodValues={newPodValues}
          setNewPodValues={setNewPodValues}
          setStep={setStep}
        />
      )}
      {step === AddLxdSteps.SELECT_PROJECT && (
        <SelectProjectForm
          clearHeaderContent={clearHeaderContent}
          newPodValues={newPodValues}
          setStep={setStep}
        />
      )}
    </>
  );
};

export default AddLxd;
