import { Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditVLAN from "../EditVLAN";

import VLANControllers from "./VLANControllers";

import Definition from "app/base/components/Definition";
import EditableSection from "app/base/components/EditableSection";
import FabricLink from "app/base/components/FabricLink";
import SpaceLink from "app/base/components/SpaceLink";
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

  if (!id || !vlan) {
    return null;
  }

  return (
    <EditableSection
      canEdit={isAdmin}
      renderContent={(editing, setEditing) =>
        editing ? (
          <EditVLAN close={() => setEditing(false)} id={id} />
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
        )
      }
      title="VLAN summary"
    />
  );
};

export default VLANSummary;
