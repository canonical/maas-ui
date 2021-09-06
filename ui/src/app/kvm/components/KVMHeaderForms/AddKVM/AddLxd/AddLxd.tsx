import { useState } from "react";

import { useSelector } from "react-redux";

import type { SetKvmType } from "../AddKVM";

import AuthenticateForm from "./AuthenticateForm";
import SelectProjectForm from "./SelectProjectForm";

import type { ClearHeaderContent } from "app/base/types";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  setKvmType: SetKvmType;
};

export type AuthenticateFormValues = {
  name: string;
  password: string;
  pool: string;
  power_address: string;
  zone: string;
};

export const AddLxd = ({
  clearHeaderContent,
  setKvmType,
}: Props): JSX.Element => {
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
    <>
      {!authenticated ? (
        <AuthenticateForm
          clearHeaderContent={clearHeaderContent}
          setAuthValues={setAuthValues}
          setKvmType={setKvmType}
        />
      ) : (
        <SelectProjectForm
          authValues={authValues}
          clearHeaderContent={clearHeaderContent}
        />
      )}
    </>
  );
};

export default AddLxd;
