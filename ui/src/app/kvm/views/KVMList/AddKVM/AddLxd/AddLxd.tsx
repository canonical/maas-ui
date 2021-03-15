import { useState } from "react";

import { useSelector } from "react-redux";

import AuthenticateForm from "./AuthenticateForm";
import SelectProjectForm from "./SelectProjectForm";

import FormCard from "app/base/components/FormCard";
import type { SetKvmType } from "app/kvm/views/KVMList/AddKVM";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

type Props = { setKvmType: SetKvmType };

export type AuthenticateFormValues = {
  name: string;
  password: string;
  pool: string;
  power_address: string;
  zone: string;
};

export const AddLxd = ({ setKvmType }: Props): JSX.Element => {
  const [authValues, setAuthValues] = useState<AuthenticateFormValues>({
    name: "",
    password: "",
    pool: "",
    power_address: "",
    zone: "",
  });
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, authValues.power_address)
  );
  // User is considered "authenticated" if they have set a LXD server address
  // and projects for it exist in state.
  const authenticated =
    Boolean(authValues.power_address) && projects.length >= 1;

  return (
    <FormCard
      sidebar={false}
      title={
        <>
          <h4>Add KVM</h4>
          <small className="u-text--muted" data-test="step-number">
            Step {!authenticated ? "1" : "2"} of 2
          </small>
        </>
      }
    >
      {!authenticated ? (
        <AuthenticateForm
          setAuthValues={setAuthValues}
          setKvmType={setKvmType}
        />
      ) : (
        <SelectProjectForm authValues={authValues} />
      )}
    </FormCard>
  );
};

export default AddLxd;
