import { useEffect } from "react";

import { Col, Icon, Row, Tooltip } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import SubnetSpace from "./SubnetSpace";
import SubnetSummaryForm from "./SubnetSummaryForm";

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
import { breakLines, unindentString } from "app/utils";

type Props = {
  id: Subnet[SubnetMeta.PK] | null;
};

const formatTooltip = (message: string) => breakLines(unindentString(message));

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
                label={
                  <>
                    Managed allocation{" "}
                    {subnet.managed ? null : (
                      <Tooltip
                        message={formatTooltip(`MAAS allocates IP addresses from
                        this subnet, excluding the reserved and dynamic
                        ranges.`)}
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
                        message={formatTooltip(
                          `When enabled, MAAS will scan this
                        subnet to discover hosts that have not been discovered
                        passively.`
                        )}
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
                      message={formatTooltip(
                        `MAAS will ${
                          subnet.allow_proxy ? "" : "not"
                        } allow clients from this subnet to access the MAAS
                      proxy.`
                      )}
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
                      message={formatTooltip(
                        `MAAS will ${
                          subnet.allow_dns ? "" : "not"
                        } allow clients from this subnet to use MAAS for DNS
                      resolution.`
                      )}
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
