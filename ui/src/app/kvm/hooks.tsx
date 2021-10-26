import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import kvmURLs from "app/kvm/urls";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { actions as vmClusterActions } from "app/store/vmcluster";
import vmClusterSelectors from "app/store/vmcluster/selectors";

/**
 * Handle setting a pod as active while a component is mounted.
 * @param id - The id of the pod to handle active state.
 */
export const useActivePod = (id: Pod["id"]): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(podActions.get(id));
    // Set pod as active to ensure all pod data is sent from the server.
    dispatch(podActions.setActive(id));

    // Unset active pod on cleanup.
    return () => {
      dispatch(podActions.setActive(null));
    };
  }, [dispatch, id]);
};

/**
 * Handle redirects for the different types of VM host at certain URLs.
 * @param id - The id of the VM host to handle redirects for.
 */
export const useKVMDetailsRedirect = (id: Pod["id"]): string | null => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const cluster = useSelector((state: RootState) =>
    podSelectors.getCluster(state, id)
  );
  const clustersLoaded = useSelector(vmClusterSelectors.loaded);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const podsLoaded = useSelector(podSelectors.loaded);

  useEffect(() => {
    dispatch(vmClusterActions.fetch());
    dispatch(podActions.fetch());
  }, [dispatch, id]);

  if (!clustersLoaded || !podsLoaded) {
    return null;
  }

  if (!pod) {
    // TODO: Show a "not found" message instead of redirecting.
    // https://github.com/canonical-web-and-design/maas-ui/issues/3149
    return kvmURLs.kvm;
  }

  const isLXDClusterHost = cluster && pod.type === PodType.LXD;
  const isLXDSingleHost = !cluster && pod.type === PodType.LXD;
  const isVirshHost = pod.type === PodType.VIRSH;
  const clusterURLs = kvmURLs.lxd.cluster;
  const singleURLs = kvmURLs.lxd.single;
  const virshURLs = kvmURLs.virsh.details;

  if (isLXDClusterHost) {
    const clusterId = cluster.id;
    const hostId = pod.id;
    if (pathname.startsWith(singleURLs.vms({ id }))) {
      return clusterURLs.vms.host({ clusterId, hostId });
    } else if (
      pathname.startsWith(singleURLs.edit({ id })) ||
      pathname.startsWith(virshURLs.edit({ id }))
    ) {
      return clusterURLs.host.edit({ clusterId, hostId });
    } else if (!pathname.startsWith(clusterURLs.index({ clusterId }))) {
      return clusterURLs.vms.host({ clusterId, hostId });
    }
  }
  if (isLXDSingleHost && !pathname.startsWith(singleURLs.index({ id }))) {
    return singleURLs.index({ id });
  }
  if (isVirshHost && !pathname.startsWith(virshURLs.index({ id }))) {
    return virshURLs.index({ id });
  }

  return null;
};
