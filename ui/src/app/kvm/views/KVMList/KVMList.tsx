import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Col, Row, Spinner, Strip } from "@canonical/react-components";
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
import vmclusterSelectors from "app/store/vmcluster/selectors";
import { actions as zoneActions } from "app/store/zone";

const KVMList = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const podsLoading = useSelector(podSelectors.loading);
  const lxdKvms = useSelector(podSelectors.lxd);
  const virshKvms = useSelector(podSelectors.virsh);
  const vmclusters = useSelector(vmclusterSelectors.all);
  const vmclustersLoading = useSelector(vmclusterSelectors.loading);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  const hasLXDs = vmclusters.length + lxdKvms.length > 0;
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
    return <Redirect to={kvmURLs.lxd.index} />;
  }

  let content: ReactNode = null;
  if (podsLoading || vmclustersLoading) {
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
    const hostType = showingLXD ? "LXD" : "Virsh";
    content = (
      <Strip data-test="no-hosts" deep>
        <Row>
          <Col className="u-flex" emptyLarge={4} size={6}>
            <div className="">
              <h4>No {hostType} hosts available</h4>
              <p>
                Select the Add {hostType} host button and add the {hostType}{" "}
                host to see hosts on this page.
              </p>
            </div>
          </Col>
        </Row>
      </Strip>
    );
  }
  return (
    <Section
      header={
        <KVMListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      {content}
    </Section>
  );
};

export default KVMList;
