import { useEffect } from "react";

import { Col, Row } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import SubnetSummaryForm from "./SubnetSummaryForm";
import ActiveDiscoveryLabel from "./components/ActiveDiscoveryLabel";
import AllowDNSResolutionLabel from "./components/AllowDNSResolutionLabel";
import ManagedAllocationLabel from "./components/ManagedAllocationLabel";
import ProxyAccessLabel from "./components/ProxyAccessLabel";
import SubnetSpace from "./components/SubnetSpace";

import Definition from "app/base/components/Definition";
import EditableSection from "app/base/components/EditableSection";
import FabricLink from "app/base/components/FabricLink";
import VLANLink from "app/base/components/VLANLink";
import { actions as fabricActions } from "app/store/fabric";
import type { RootState } from "app/store/root/types";
import { actions as spaceActions } from "app/store/space";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type Props = {
  id: Subnet[SubnetMeta.PK] | null;
};

const SubnetSummary = ({ id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, subnet?.vlan)
  );

  useEffect(() => {
    dispatch(spaceActions.fetch());
    dispatch(vlanActions.fetch());
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  if (!subnet) {
    return null;
  }

  return (
    <EditableSection
      renderContent={(editing, setEditing) =>
        editing ? (
          <SubnetSummaryForm
            id={subnet.id}
            handleDismiss={() => setEditing(false)}
          />
        ) : (
          <Row>
            <Col size={6}>
              <Definition label="Name" description={subnet.name} />
              <Definition label="CIDR" description={subnet.cidr} />
              <Definition label="Gateway IP">{subnet.gateway_ip}</Definition>
              <Definition label="DNS" description={subnet.dns_servers} />
              <Definition
                label="Description"
                description={subnet.description}
              />
              <Definition
                label={<ManagedAllocationLabel managed={subnet.managed} />}
              >
                {subnet.managed ? "Enabled" : "Disabled"}
              </Definition>
            </Col>
            <Col size={6}>
              <Definition
                label={<ActiveDiscoveryLabel managed={subnet.managed} />}
              >
                {subnet.active_discovery ? "Enabled" : "Disabled"}
              </Definition>
              <Definition
                label={<ProxyAccessLabel allowProxy={subnet.allow_proxy} />}
              >
                {subnet.allow_proxy ? "Allowed" : "Disallowed"}
              </Definition>
              <Definition
                label={<AllowDNSResolutionLabel allowDNS={subnet.allow_dns} />}
              >
                {subnet.allow_dns ? "Allowed" : "Disallowed"}
              </Definition>
              <Definition label="Fabric">
                <FabricLink id={vlan?.fabric} />
              </Definition>
              <Definition label="VLAN">
                <VLANLink id={subnet.vlan} />
              </Definition>
              <SubnetSpace spaceId={subnet.space} />
            </Col>
          </Row>
        )
      }
      title="Subnet summary"
    />
  );
};

export default SubnetSummary;