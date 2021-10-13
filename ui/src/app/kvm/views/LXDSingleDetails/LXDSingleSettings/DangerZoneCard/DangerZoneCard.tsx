import { Button, Col, Row } from "@canonical/react-components";

import FormCard from "app/base/components/FormCard";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import type { Pod } from "app/store/pod/types";

type Props = {
  hostId: Pod["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const DangerZoneCard = ({ hostId, setHeaderContent }: Props): JSX.Element => {
  return (
    <FormCard highlighted={false} sidebar={false} title="Danger zone">
      <Row>
        <Col size={5}>
          <p>
            <strong>Remove this KVM</strong>
          </p>
          <p>
            Once a KVM is removed, you can still access this project from the
            LXD server.
          </p>
        </Col>
        <Col className="u-align--right u-flex--column-align-end" size={5}>
          <Button
            appearance="neutral"
            data-test="remove-kvm"
            onClick={() =>
              setHeaderContent({
                view: KVMHeaderViews.DELETE_KVM,
                extras: { hostId },
              })
            }
          >
            Remove KVM
          </Button>
        </Col>
      </Row>
    </FormCard>
  );
};

export default DangerZoneCard;
