import { useCallback, useEffect } from "react";

import { Button, Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { SetSelectedAction } from "../KVMDetails";
import { KVMAction } from "../KVMDetails";

import KVMConfigurationFields from "./KVMConfigurationFields";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useWindowTitle } from "app/base/hooks";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { PodType } from "app/store/pod/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { formatErrors } from "app/utils";

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

type Props = {
  id: Pod["id"];
  setSelectedAction: SetSelectedAction;
};

const KVMConfiguration = ({ id, setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podErrors = useSelector(podSelectors.errors);
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const errors = formatErrors(podErrors);
  const cleanup = useCallback(() => podActions.cleanup(), []);

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} configuration`);

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const loaded = resourcePoolsLoaded && tagsLoaded && zonesLoaded;

  if (!!pod && loaded) {
    const podPassword =
      pod.type === PodType.LXD ? pod.password : pod.power_pass;

    return (
      <>
        <FormCard sidebar={false} title="KVM configuration">
          <FormikForm
            buttons={FormCardButtons}
            cleanup={cleanup}
            errors={errors}
            initialValues={{
              cpu_over_commit_ratio: pod.cpu_over_commit_ratio,
              memory_over_commit_ratio: pod.memory_over_commit_ratio,
              password: podPassword || "",
              pool: `${pod.pool}`, // Convert to string for valid options HTML, also API expects string
              power_address: pod.power_address,
              tags: pod.tags,
              type: pod.type,
              zone: `${pod.zone}`, // Convert to string for valid options HTML, also API expects string
            }}
            onSaveAnalytics={{
              action: "Edit KVM",
              category: "KVM details settings",
              label: "KVM configuration form",
            }}
            onSubmit={(values: KVMConfigurationValues) => {
              const params = {
                cpu_over_commit_ratio: values.cpu_over_commit_ratio,
                id: pod.id,
                memory_over_commit_ratio: values.memory_over_commit_ratio,
                password:
                  (values.type === "lxd" && values.password) || undefined,
                pool: values.pool,
                power_address: values.power_address,
                power_pass:
                  (values.type !== "lxd" && values.password) || undefined,
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
        {pod.type === PodType.LXD && (
          <FormCard sidebar={false} title="Danger zone">
            <Row>
              <Col size="5">
                <p>
                  <strong>Remove this KVM</strong>
                </p>
                <p>
                  Once a KVM is removed, you can still access this project from
                  the LXD server.
                </p>
              </Col>
              <Col className="u-align--right u-flex--column-align-end" size="5">
                <Button
                  appearance="neutral"
                  data-test="remove-kvm"
                  onClick={() => setSelectedAction(KVMAction.DELETE)}
                >
                  Remove KVM
                </Button>
              </Col>
            </Row>
          </FormCard>
        )}
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMConfiguration;
