import { useEffect } from "react";

import { Row, Col, Tooltip, Icon } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import Definition from "app/base/components/Definition";
import FabricLink from "app/base/components/FabricLink";
import SpaceLink from "app/base/components/SpaceLink";
import TitledSection from "app/base/components/TitledSection";
import VLANLink from "app/base/components/VLANLink";
import { actions as fabricActions } from "app/store/fabric";
import type { RootState } from "app/store/root/types";
import { actions as spaceActions } from "app/store/space";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { isId } from "app/utils";

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
    <TitledSection title="Subnet summary">
      <Row>
        <Col size={6}>
          <Definition label="Name" description={subnet.name} />
          <Definition label="CIDR" description={subnet.cidr} />
          <Definition label="Gateway IP">{subnet.gateway_ip}</Definition>
          <Definition label="DNS" description={subnet.dns_servers} />
          <Definition label="Description" description={subnet.description} />
          <Definition
            label={
              <>
                Managed allocation{" "}
                {subnet.managed ? null : (
                  <Tooltip
                    message="MAAS allocates IP addresses 
                  from this subnet, exluding the 
                  reserved and dynamic ranges."
                    position="btm-right"
                  >
                    <Icon name="information" />
                  </Tooltip>
                )}
              </>
            }
          >
            {subnet.managed ? "Enabled" : "Disabled"}
          </Definition>
        </Col>
        <Col size={6}>
          <Definition
            label={
              <>
                Active discovery{" "}
                {subnet.managed ? (
                  <Tooltip
                    message="When enabled, MAAS will scan 
this subnet to discover hosts 
that have not been discovered 
passively."
                    position="btm-right"
                  >
                    <Icon name="information" />
                  </Tooltip>
                ) : null}
              </>
            }
          >
            {subnet.active_discovery ? "Enabled" : "Disabled"}
          </Definition>
          <Definition
            label={
              <>
                Proxy access{" "}
                <Tooltip
                  data-testid="proxy-access-tooltip"
                  message={`MAAS will${
                    subnet.allow_proxy ? "" : " not"
                  } allow clients from 
this subnet to access the 
MAAS proxy.`}
                  position="btm-right"
                >
                  <Icon name="information" />
                </Tooltip>
              </>
            }
          >
            {subnet.allow_proxy ? "Allowed" : "Disallowed"}
          </Definition>
          <Definition
            label={
              <>
                Allow DNS resolution{" "}
                <Tooltip
                  data-testid="allow-dns-tooltip"
                  message={`MAAS will${
                    subnet.allow_dns ? "" : " not"
                  } allow clients from 
this subnet to use MAAS 
for DNS resolution.`}
                  position="btm-right"
                >
                  <Icon name="information" />
                </Tooltip>
              </>
            }
          >
            {subnet.allow_dns ? "Allowed" : "Disallowed"}
          </Definition>
          <Definition label="Fabric">
            <FabricLink id={vlan?.fabric} />
          </Definition>
          <Definition label="VLAN">
            <VLANLink id={subnet.vlan} />
          </Definition>
          <Definition label="Space">
            <>
              <SpaceLink id={subnet.space} />
              {isId(subnet.space) ? null : (
                <>
                  {" "}
                  <Tooltip
                    message="This subnet does not belong to 
a space. MAAS integrations require 
a space in order to determine the 
purpose of a network."
                    position="btm-right"
                  >
                    <Icon name="warning" />
                  </Tooltip>
                </>
              )}
            </>
          </Definition>
        </Col>
      </Row>
    </TitledSection>
  );
};

export default SubnetSummary;
