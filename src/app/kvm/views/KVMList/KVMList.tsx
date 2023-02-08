import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Col, Row, Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";

import KVMListHeader from "./KVMListHeader";
import LxdTable from "./LxdTable";
import VirshTable from "./VirshTable";

import MainContentSection from "app/base/components/MainContentSection";
import { useWindowTitle } from "app/base/hooks";
import urls from "app/base/urls";
import type { KVMSidePanelContent } from "app/kvm/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { actions as poolActions } from "app/store/resourcepool";
import { actions as vmclusterActions } from "app/store/vmcluster";
import vmclusterSelectors from "app/store/vmcluster/selectors";
import { actions as zoneActions } from "app/store/zone";

export enum Label {
  Title = "KVM list",
}

const KVMList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const podsLoading = useSelector(podSelectors.loading);
  const lxdKvms = useSelector(podSelectors.lxd);
  const virshKvms = useSelector(podSelectors.virsh);
  const vmclusters = useSelector(vmclusterSelectors.all);
  const vmclustersLoading = useSelector(vmclusterSelectors.loading);
  const [sidePanelContent, setSidePanelContent] =
    useState<KVMSidePanelContent | null>(null);
  const hasLXDs = vmclusters.length + lxdKvms.length > 0;
  const hasVirsh = virshKvms.length > 0;
  const showingLXD = location.pathname.endsWith(urls.kvm.lxd.index);
  const showingVirsh = location.pathname.endsWith(urls.kvm.virsh.index);
  const title = showingLXD ? "LXD" : showingVirsh ? "Virsh" : "KVM";
  useWindowTitle(title);

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(vmclusterActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  // Redirect to the appropriate tab when arriving at /kvm.
  useEffect(() => {
    if (!showingLXD && !showingVirsh) {
      navigate(urls.kvm.lxd.index, { replace: true });
    }
  }, [navigate, showingLXD, showingVirsh]);

  let content: ReactNode = null;
  if (podsLoading || vmclustersLoading) {
    content = <Spinner text="Loading..." />;
  } else if (showingLXD && hasLXDs) {
    content = (
      <Strip className="u-no-padding--bottom" data-testid="lxd-table" shallow>
        <LxdTable />
      </Strip>
    );
  } else if (showingVirsh && hasVirsh) {
    content = (
      <Strip data-testid="virsh-table" shallow>
        <VirshTable />
      </Strip>
    );
  } else {
    const hostType = showingLXD ? "LXD" : "Virsh";
    content = (
      <Strip data-testid="no-hosts" deep>
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
    <MainContentSection
      aria-label={Label.Title}
      header={
        <KVMListHeader
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={sidePanelContent}
          title={title}
        />
      }
    >
      {content}
    </MainContentSection>
  );
};

export default KVMList;
