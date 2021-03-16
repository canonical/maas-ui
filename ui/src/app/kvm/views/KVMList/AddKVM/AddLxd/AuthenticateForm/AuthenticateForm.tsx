import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import type { AuthenticateFormValues } from "../AddLxd";

import AuthenticateFormFields from "./AuthenticateFormFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import type { SetKvmType } from "app/kvm/views/KVMList/AddKVM";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  setAuthValues: (values: AuthenticateFormValues) => void;
  setKvmType: SetKvmType;
};

const AuthenticateFormSchema: SchemaOf<AuthenticateFormValues> = Yup.object()
  .shape({
    name: Yup.string().required("Name is required"),
    password: Yup.string(),
    pool: Yup.string().required("Resource pool required"),
    power_address: Yup.string().required("Address is required"),
    zone: Yup.string().required("Zone required"),
  })
  .defined();

export const AuthenticateForm = ({
  setAuthValues,
  setKvmType,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector(podSelectors.errors);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    if (Boolean(errors)) {
      setAuthenticating(false);
    }
  }, [errors]);

  return (
    <FormikForm<AuthenticateFormValues>
      buttons={FormCardButtons}
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        name: "",
        password: "",
        pool: resourcePools.length ? `${resourcePools[0].id}` : "",
        power_address: "",
        zone: zones.length ? `${zones[0].id}` : "",
      }}
      onCancel={() => history.push({ pathname: "/kvm" })}
      onSubmit={(values: AuthenticateFormValues) => {
        dispatch(cleanup());
        setAuthValues(values);
        setAuthenticating(true);
        dispatch(
          podActions.getProjects({
            password: values.password,
            power_address: values.power_address,
            type: PodType.LXD,
          })
        );
      }}
      saving={authenticating}
      submitLabel="Authenticate"
      validationSchema={AuthenticateFormSchema}
    >
      <AuthenticateFormFields setKvmType={setKvmType} />
    </FormikForm>
  );
};

export default AuthenticateForm;
