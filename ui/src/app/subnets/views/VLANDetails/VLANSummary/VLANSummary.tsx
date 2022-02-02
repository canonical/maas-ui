import { useState } from "react";

import { Button, Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditVLAN from "../EditVLAN";

import VLANControllers from "./VLANControllers";

import Definition from "app/base/components/Definition";
import FabricLink from "app/base/components/FabricLink";
import SpaceLink from "app/base/components/SpaceLink";
import TitledSection from "app/base/components/TitledSection";
import authSelectors from "app/store/auth/selectors";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";

type Props = {
  id: VLAN[VLANMeta.PK] | null;
};

const VLANSummary = ({ id }: Props): JSX.Element | null => {
  const isAdmin = useSelector(authSelectors.isAdmin);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const [editing, setEditing] = useState(false);
  const canEdit = isAdmin;

  if (!id || !vlan) {
    return null;
  }
  return (
    <TitledSection
      title="VLAN summary"
      buttons={
        canEdit &&
        !editing && (
          <Button
            appearance="neutral"
            className="u-no-margin--bottom"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )
      }
    >
      {editing ? (
        <EditVLAN
          close={() => setEditing(false)}
          data-testid="EditVLAN"
          id={id}
        />
      ) : (
        <Row>
          <Col size={6}>
            <Definition label="VID" description={`${vlan.vid}`} />
            <Definition label="Name" description={vlan.name} />
            <Definition label="MTU" description={`${vlan.mtu}`} />
            <Definition label="Description" description={vlan.description} />
          </Col>
          <Col size={6}>
            <Definition label="Space">
              <SpaceLink id={vlan.space} />
            </Definition>
            <Definition label="Fabric">
              <FabricLink id={vlan.fabric} />
            </Definition>
            <VLANControllers id={id} />
          </Col>
        </Row>
      )}
    </TitledSection>
  );
};

export default VLANSummary;
