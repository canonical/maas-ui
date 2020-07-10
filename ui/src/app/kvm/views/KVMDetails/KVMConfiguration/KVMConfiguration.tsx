import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import type { RootState } from "app/store/root/types";
import type { Pod } from "app/store/pod/types";
import {
  pod as podActions,
  resourcepool as resourcePoolActions,
  tag as tagActions,
  zone as zoneActions,
} from "app/base/actions";
import {
  pod as podSelectors,
  resourcepool as resourcePoolSelectors,
  tag as tagSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import { formatErrors } from "app/utils";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import KVMConfigurationFields from "./KVMConfigurationFields";

const KVMConfigurationSchema = Yup.object().shape({
  cpu_over_commit_ratio: Yup.number().required("CPU overcommit ratio required"),
  memory_over_commit_ratio: Yup.number().required(
    "Memory overcommit ratio required"
  ),
  pool: Yup.string().required("Resource pool required"),
  power_address: Yup.string().required("Address required"),
  password: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  type: Yup.string().required("Type required"),
  zone: Yup.string().required("Zone required"),
});

export type KVMConfigurationValues = {
  cpu_over_commit_ratio: Pod["cpu_over_commit_ratio"];
  memory_over_commit_ratio: Pod["memory_over_commit_ratio"];
  pool: Pod["pool"];
  power_address: Pod["power_address"];
  password: Pod["password"] | Pod["power_pass"];
  tags: Pod["tags"];
  type: Pod["type"];
  zone: Pod["zone"];
};

const KVMConfiguration = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podErrors = useSelector(podSelectors.errors);
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const errors = formatErrors(podErrors);

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} configuration`);

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const loaded = resourcePoolsLoaded && tagsLoaded && zonesLoaded;

  if (typeof pod === "object" && loaded) {
    const podPassword = pod.type === "lxd" ? pod.password : pod.power_pass;

    return (
      <FormCard sidebar={false} title="KVM configuration">
        <FormikForm
          buttons={FormCardButtons}
          cleanup={podActions.cleanup}
          errors={errors}
          initialValues={{
            cpu_over_commit_ratio: pod.cpu_over_commit_ratio,
            memory_over_commit_ratio: pod.memory_over_commit_ratio,
            password: podPassword,
            pool: `${pod.pool}`, // Convert to string for valid options HTML, also API expects string
            power_address: pod.power_address,
            tags: pod.tags,
            type: pod.type,
            zone: `${pod.zone}`, // Convert to string for valid options HTML, also API expects string
          }}
          onCancel={() => history.push({ pathname: `/kvm/${id}` })}
          onSaveAnalytics={{
            action: "Edit KVM",
            category: "KVM",
            label: "KVM configuration form",
          }}
          onSubmit={(values: KVMConfigurationValues) => {
            const params = {
              cpu_over_commit_ratio: values.cpu_over_commit_ratio,
              id: pod.id,
              memory_over_commit_ratio: values.memory_over_commit_ratio,
              password: values.type === "lxd" ? values.password : undefined,
              pool: values.pool,
              power_address: values.power_address,
              power_pass: values.type === "lxd" ? undefined : values.password,
              tags: values.tags.join(","), // API expects comma-separated string
              zone: values.zone,
            };
            dispatch(podActions.update(params));
          }}
          saving={podSaving}
          saved={podSaved}
          submitLabel="Save changes"
          validationSchema={KVMConfigurationSchema}
        >
          <KVMConfigurationFields />
        </FormikForm>
      </FormCard>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMConfiguration;
