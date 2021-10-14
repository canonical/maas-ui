import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router";

import KVMListHeader from "./KVMListHeader";
import LxdTable from "./LxdTable";
import VirshTable from "./VirshTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { actions as poolActions } from "app/store/resourcepool";
import { actions as vmclusterActions } from "app/store/vmcluster";
import { actions as zoneActions } from "app/store/zone";

const KVMList = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const loading = useSelector(podSelectors.loading);
  const lxdKvms = useSelector(podSelectors.lxd);
  const virshKvms = useSelector(podSelectors.virsh);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  const hasLXDs = lxdKvms.length > 0;
  const hasVirsh = virshKvms.length > 0;
  const showingLXD = location.pathname.endsWith(kvmURLs.lxd.index);
  const showingVirsh = location.pathname.endsWith(kvmURLs.virsh.index);
  useWindowTitle("KVM");

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(vmclusterActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  // Redirect to the appropriate tab when arriving at /kvm.
  if (!showingLXD && !showingVirsh) {
    if (hasLXDs) {
      return <Redirect to={kvmURLs.lxd.index} />;
    } else if (hasVirsh) {
      return <Redirect to={kvmURLs.virsh.index} />;
    }
  }

  let content: ReactNode = null;
  if (loading) {
    content = <Spinner text="Loading..." />;
  } else if (showingLXD && hasLXDs) {
    content = (
      <Strip className="u-no-padding--bottom" data-test="lxd-table" shallow>
        <LxdTable />
      </Strip>
    );
  } else if (showingVirsh && hasVirsh) {
    content = (
      <Strip data-test="virsh-table" shallow>
        <VirshTable />
      </Strip>
    );
  } else {
    content = (
      <p data-test="no-hosts">No KVM hosts have been added to this MAAS.</p>
    );
  }
  return (
    <Section
      header={
        <KVMListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          showLXDtab={hasLXDs}
          showVirshtab={hasVirsh}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      {content}
    </Section>
  );
};

export default KVMList;
