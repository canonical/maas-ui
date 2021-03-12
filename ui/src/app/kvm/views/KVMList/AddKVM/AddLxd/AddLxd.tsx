import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import type { SetKvmType } from "../AddKVM";

import AddLxdFields from "./AddLxdFields";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import zoneSelectors from "app/store/zone/selectors";

type Props = { setKvmType: SetKvmType };

export type AddLxdValues = {
  name?: string;
  password?: string;
  pool: string;
  power_address: string;
  project: string;
  zone: string;
};

const AddLxdSchema: SchemaOf<AddLxdValues> = Yup.object().shape({
  name: Yup.string(),
  password: Yup.string(),
  pool: Yup.string().required("Resource pool required"),
  power_address: Yup.string().required("Address is required"),
  project: Yup.string().required("Project is required"),
  zone: Yup.string().required("Zone required"),
});

export const AddLxd = ({ setKvmType }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [lxdAddress, setLxdAddress] = useState("");
  const projects = useSelector((state: RootState) =>
    podSelectors.getProjectsByLxdServer(state, lxdAddress)
  );
  const errors = useSelector(podSelectors.errors);
  const saving = useSelector(podSelectors.saving);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const [authenticating, setAuthenticating] = useState(false);
  // User is considered "authenticated" if they have set a LXD server address
  // and projects for it exist in state.
  const authenticated = Boolean(lxdAddress) && projects.length >= 1;

  useEffect(() => {
    if (authenticated || Boolean(errors)) {
      setAuthenticating(false);
    }
  }, [authenticated, errors]);

  return (
    <FormCard sidebar={false} title="Add KVM">
      <FormikForm<AddLxdValues>
        buttons={FormCardButtons}
        cleanup={cleanup}
        errors={errors}
        initialValues={{
          name: "",
          password: "",
          pool: resourcePools.length ? `${resourcePools[0].id}` : "",
          power_address: "",
          project: "default",
          zone: zones.length ? `${zones[0].id}` : "",
        }}
        onCancel={() => history.push({ pathname: "/kvm" })}
        onSaveAnalytics={{
          action: "Save LXD KVM",
          category: "Add KVM form",
          label: "Save KVM",
        }}
        onSubmit={(values: AddLxdValues) => {
          if (authenticated) {
            dispatch(
              podActions.create({
                name: values.name,
                password: values.password,
                pool: Number(values.pool),
                power_address: values.power_address,
                project: values.project,
                type: PodType.LXD,
                zone: Number(values.zone),
              })
            );
          } else {
            dispatch(cleanup());
            setLxdAddress(values.power_address);
            if (projects.length === 0) {
              setAuthenticating(true);
              dispatch(
                podActions.getProjects({
                  password: values.password,
                  power_address: values.power_address,
                  type: PodType.LXD,
                })
              );
            }
          }
        }}
        saving={saving || authenticating}
        savedRedirect="/kvm"
        submitLabel={authenticated ? "Next" : "Authenticate"}
        validationSchema={AddLxdSchema}
      >
        <AddLxdFields setKvmType={setKvmType} />
      </FormikForm>
    </FormCard>
  );
};

export default AddLxd;
