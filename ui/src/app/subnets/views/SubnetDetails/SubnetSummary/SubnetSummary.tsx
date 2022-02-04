import { useEffect } from "react";

import { Row, Col, Tooltip, Icon } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import TitledSection from "app/base/components/TitledSection";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { getFabricById } from "app/store/fabric/utils";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import { getSpaceById } from "app/store/space/utils";
import type { Subnet } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { getVlanById } from "app/store/vlan/utils";

type Props = {
  subnet: Subnet;
};

const SubnetSummary = ({ subnet }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const spaces = useSelector(spaceSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const fabrics = useSelector(fabricSelectors.all);
  const space = getSpaceById(spaces, subnet.space) || null;
  const vlan = getVlanById(vlans, subnet.vlan) || null;
  const fabric = vlan ? getFabricById(fabrics, vlan.fabric) : null;

  useEffect(() => {
    dispatch(spaceActions.fetch());
    dispatch(vlanActions.fetch());
    dispatch(fabricActions.fetch());
  }, [dispatch]);

  return (
    <TitledSection title="Subnet summary">
      <Row>
        <Col size={6}>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-name">
                Name
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-name">{subnet.name}</p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-cidr">
                CIDR
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-cidr">{subnet.cidr}</p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-gateway-ip">
                Gateway IP
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-gateway-ip">{subnet.gateway_ip}</p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-dns">
                DNS
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-dns">{subnet.dns_servers}</p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-description">
                Description
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-description">{subnet.description}</p>
            </Col>
          </Row>
        </Col>
        <Col size={6}>
          <Row>
            <Col size={2}>
              <p className="u-text--muted">
                <span id="subnet-managed-allocation">Managed allocation</span>{" "}
                <Tooltip
                  message="MAAS allocates IP addresses 
from this subnet, exluding the 
reserved and dynamic ranges."
                  position="btm-right"
                >
                  <Icon name="information" />
                </Tooltip>
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-managed-allocation">
                {subnet.managed ? "Enabled" : "Disabled"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-active-discovery">
                <span id="subnet-active-discovery">Active discovery</span>{" "}
                <Tooltip
                  message="When enabled, MAAS will scan 
this subnet to discover hosts 
that have not been discovered 
passively."
                  position="btm-right"
                >
                  <Icon name="information" />
                </Tooltip>
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-active-discovery">
                {subnet.active_discovery ? "Enabled" : "Disabled"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-proxy-access">
                <span id="subnet-proxy-access">Proxy access</span>{" "}
                <Tooltip
                  message="MAAS will allow clients from 
this subnet to access the 
MAAS proxy."
                  position="btm-right"
                >
                  <Icon name="information" />
                </Tooltip>
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-proxy-access">
                {subnet.allow_proxy ? "Allowed" : "Disallowed"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-allow-dns-resolution">
                <span id="subnet-allow-dns-resolution">
                  Allow DNS resolution
                </span>{" "}
                <Tooltip
                  message="MAAS will allow clients from 
this subnet to use MAAS 
for DNS resolution."
                  position="btm-right"
                >
                  <Icon name="information" />
                </Tooltip>
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-allow-dns-resolution">
                {subnet.allow_dns ? "Allowed" : "Disallowed"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-fabric">
                Fabric
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-fabric">
                {fabric ? fabric.name : "No fabric"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-vlan">
                VLAN
              </p>
            </Col>
            <Col size={4}>
              <p aria-labelledby="subnet-vlan">
                {vlan && vlan.name ? vlan.name : "untagged"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col size={2}>
              <p className="u-text--muted" id="subnet-space">
                Space
              </p>
            </Col>
            <Col size={4}>
              <p>
                {space && space.name ? (
                  <span aria-labelledby="subnet-space">{space.name}</span>
                ) : (
                  <>
                    <span aria-labelledby="subnet-space">No space</span>{" "}
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
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </TitledSection>
  );
};

export default SubnetSummary;
