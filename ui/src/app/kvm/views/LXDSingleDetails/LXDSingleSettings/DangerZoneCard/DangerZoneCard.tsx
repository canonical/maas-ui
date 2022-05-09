import type { ReactNode } from "react";

import { Button, Col, Row } from "@canonical/react-components";

import FormCard from "app/base/components/FormCard";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import type { Pod, PodMeta } from "app/store/pod/types";
import type { VMCluster, VMClusterMeta } from "app/store/vmcluster/types";

type Props = {
  clusterId?: VMCluster[VMClusterMeta.PK];
  hostId?: Pod[PodMeta.PK];
  message: ReactNode;
  setHeaderContent: KVMSetHeaderContent;
};

const DangerZoneCard = ({
  clusterId,
  hostId,
  message,
  setHeaderContent,
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
              setHeaderContent({
                extras: { clusterId, hostId },
                view: KVMHeaderViews.DELETE_KVM,
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
