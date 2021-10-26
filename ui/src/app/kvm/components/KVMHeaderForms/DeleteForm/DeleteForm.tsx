import { useCallback } from "react";

import { Col, Icon, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";
import type { ClearHeaderContent } from "app/base/types";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod, PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { actions as vmClusterActions } from "app/store/vmcluster";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster, VMClusterMeta } from "app/store/vmcluster/types";

type DeleteFormValues = {
  decompose: boolean;
};

type Props = {
  clearHeaderContent: ClearHeaderContent;
  clusterId?: VMCluster[VMClusterMeta.PK] | null;
  hostId?: Pod[PodMeta.PK] | null;
};

const DeleteFormSchema = Yup.object().shape({
  decompose: Yup.boolean(),
});

const DeleteForm = ({
  clearHeaderContent,
  clusterId,
  hostId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const errors = useSelector(podSelectors.errors);
  const podsDeleting = useSelector(podSelectors.deleting);
  const clusterDeleting = useSelector((state: RootState) =>
    vmClusterSelectors.status(state, "deleting")
  );
  const cleanup = useCallback(() => podActions.cleanup(), []);
  const showRemoveMessage = (pod && pod.type === PodType.LXD) || cluster;
  const clusterDeletingCount = clusterDeleting ? 1 : 0;
  const deletingCount = pod ? podsDeleting.length : clusterDeletingCount;

  if (!pod && !cluster) {
    return null;
  }

  return (
    <ActionForm<DeleteFormValues>
      actionName="remove"
      allowAllEmpty
      allowUnchanged
      cleanup={cleanup}
      clearHeaderContent={clearHeaderContent}
      errors={errors}
      initialValues={{
        decompose: false,
      }}
      modelName={pod ? "KVM" : "cluster"}
      onSaveAnalytics={{
        action: "Submit",
        category: "KVM details action form",
        label: `Remove ${pod ? "KVM" : "cluster"}`,
      }}
      onSubmit={(values: DeleteFormValues) => {
        if (pod) {
          dispatch(
            podActions.delete({
              decompose: values.decompose,
              id: pod.id,
            })
          );
        } else if (cluster) {
          dispatch(
            vmClusterActions.delete({
              decompose: values.decompose,
              id: cluster.id,
            })
          );
        }
      }}
      processingCount={deletingCount}
      selectedCount={deletingCount}
      submitAppearance="negative"
      validationSchema={DeleteFormSchema}
    >
      {showRemoveMessage && (
        <Strip shallow>
          <Col size={6}>
            <p>
              <Icon className="is-inline" name="warning" />
              Once a {pod ? "KVM" : "cluster"} is removed, you can still access
              all VMs in this {pod ? "project" : "cluster"} from the LXD server.
            </p>
            <FormikField
              label={
                <>
                  Selecting this option will delete all VMs in{" "}
                  <strong>{pod?.name || cluster?.name}</strong> along with their
                  storage.
                </>
              }
              name="decompose"
              type="checkbox"
              wrapperClassName="u-nudge-right--large"
            />
          </Col>
        </Strip>
      )}
    </ActionForm>
  );
};

export default DeleteForm;
