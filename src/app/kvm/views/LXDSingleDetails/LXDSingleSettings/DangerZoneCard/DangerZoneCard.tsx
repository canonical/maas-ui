import type { ReactNode } from "react";

import { Button, Col, Row } from "@canonical/react-components";

import FormCard from "app/base/components/FormCard";
import { KVMSidePanelViews } from "app/kvm/constants";
import type { KVMSetSidePanelContent } from "app/kvm/types";
import type { Pod, PodMeta } from "app/store/pod/types";
import type { VMCluster, VMClusterMeta } from "app/store/vmcluster/types";

type Props = {
  clusterId?: VMCluster[VMClusterMeta.PK];
  hostId?: Pod[PodMeta.PK];
  message: ReactNode;
  setSidePanelContent: KVMSetSidePanelContent;
};

const DangerZoneCard = ({
  clusterId,
  hostId,
  message,
  setSidePanelContent,
}: Props): JSX.Element => {
  return (
    <FormCard highlighted={false} sidebar={false} title="Danger zone">
      <Row>
        <Col size={5}>{message}</Col>
        <Col className="u-align--right u-vertically-center" size={5}>
          <Button
            className="u-no-margin--bottom"
            data-testid="remove-kvm"
            onClick={() =>
              setSidePanelContent({
                view: KVMSidePanelViews.DELETE_KVM,
                extras: { clusterId, hostId },
              })
            }
          >
            {!!clusterId || clusterId === 0
              ? "Remove cluster"
              : "Remove KVM host"}
          </Button>
        </Col>
      </Row>
    </FormCard>
  );
};

export default DangerZoneCard;
