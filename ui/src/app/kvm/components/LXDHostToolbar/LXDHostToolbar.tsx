import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button, Icon, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Switch from "app/base/components/Switch";
import { useSendAnalytics } from "app/base/hooks";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId?: VMCluster["id"];
  hostId: Pod["id"];
  setHeaderContent?: KVMSetHeaderContent;
  setViewByNuma?: (viewByNuma: boolean) => void;
  showBasic?: boolean;
  title?: ReactNode;
  viewByNuma?: boolean;
};

const LXDHostToolbar = ({
  clusterId,
  hostId,
  setHeaderContent,
  setViewByNuma,
  showBasic,
  title,
  viewByNuma,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const pool = useSelector((state: RootState) =>
    resourcePoolSelectors.getById(state, pod?.pool)
  );
  const sendAnalytics = useSendAnalytics();

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  if (!pod) {
    return null;
  }

  const inClusterView = clusterId !== undefined;
  const canViewByNuma = pod.resources.numa.length >= 1;
  // Safeguard in case local storage is set to true even though the pod has no
  // known NUMA nodes.
  const showNumaCards = viewByNuma && canViewByNuma;

  return (
    <div className="lxd-host-toolbar">
      <div className="lxd-host-toolbar__title">
        <h2
          className="p-heading--4 u-no-margin--bottom u-no-padding--top"
          data-test="toolbar-title"
        >
          {title ? title : pod.name}
        </h2>
        {inClusterView && !showBasic && (
          <div className="u-nudge-up--x-small">
            <Link to={kvmURLs.lxd.cluster.host.edit({ clusterId, hostId })}>
              <Icon name="settings" />
            </Link>{" "}
            <Button
              appearance="link"
              data-test="settings-link"
              element={Link}
              to={kvmURLs.lxd.cluster.host.edit({ clusterId, hostId })}
            >
              Host settings
            </Button>
          </div>
        )}
      </div>
      <div className="lxd-host-toolbar__blocks p-divider u-nudge-down--x-small">
        <div className="p-divider__block" data-test="lxd-version">
          <p className="u-text--muted u-no-margin u-no-padding">LXD version:</p>
          <p className="u-no-margin u-no-padding">{pod.version}</p>
        </div>
        {setHeaderContent && !showBasic ? (
          <>
            <div className="p-divider__block">
              <p className="u-text--muted u-no-margin u-no-padding">
                Resource pool:
              </p>
              <p className="u-no-margin u-no-padding" data-test="pod-pool">
                {pool?.name || <Spinner />}
              </p>
            </div>
            {!inClusterView && (
              <div className="p-divider__block">
                <p className="u-text--muted u-no-margin u-no-padding">Tags:</p>
                <p className="u-no-margin u-no-padding" data-test="pod-tags">
                  {pod.tags.join(", ")}
                </p>
              </div>
            )}
            <div className="p-divider__block">
              <Button
                data-test="add-virtual-machine"
                hasIcon
                onClick={() =>
                  setHeaderContent({
                    view: KVMHeaderViews.COMPOSE_VM,
                    extras: { hostId },
                  })
                }
              >
                <Icon name="plus" />
                <span>Add virtual machine</span>
              </Button>
            </div>
          </>
        ) : null}
      </div>
      {canViewByNuma && setViewByNuma && !showBasic && (
        <div className="lxd-host-toolbar__switch">
          <Switch
            checked={showNumaCards}
            className="p-switch--inline-label"
            data-test="numa-switch"
            label="View by NUMA node"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              const checked = evt.target.checked;
              setViewByNuma(checked);
              sendAnalytics(
                "LXD host VMs",
                "Toggle NUMA view",
                checked ? "View by NUMA node" : "View aggregate"
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LXDHostToolbar;
