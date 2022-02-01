import { useRef } from "react";

import {
  Col,
  Icon,
  Row,
  Spinner,
  Strip,
  Tooltip,
} from "@canonical/react-components";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

import ControllerLink from "app/base/components/ControllerLink";
import Definition from "app/base/components/Definition";
import FabricLink from "app/base/components/FabricLink";
import SpaceLink from "app/base/components/SpaceLink";
import controllerSelectors from "app/store/controller/selectors";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { breakLines } from "app/utils";

type Props = {
  id: VLAN[VLANMeta.PK] | null;
};

const getRackIDs = (vlan: VLAN | null) => {
  const rackIDs = [];
  if (vlan) {
    if (vlan.primary_rack) {
      rackIDs.push(vlan.primary_rack);
    }
    if (vlan.secondary_rack) {
      rackIDs.push(vlan.secondary_rack);
    }
  }
  return rackIDs;
};

const VLANSummary = ({ id }: Props): JSX.Element | null => {
  const sectionID = useRef(nanoid());
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const controllers = useSelector((state: RootState) =>
    controllerSelectors.getByIDs(state, getRackIDs(vlan))
  );
  const controllersLoading = useSelector(controllerSelectors.loading);

  if (!vlan) {
    return null;
  }
  return (
    <Strip aria-labelledby={sectionID.current} element="section" shallow>
      <h2 className="p-heading--4" id={sectionID.current}>
        VLAN summary
      </h2>
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
          <Definition
            label={
              <>
                Rack controllers
                <Tooltip
                  className="u-nudge-right--small"
                  message={breakLines(
                    "A rack controller controls hosts and images and runs network services like DHCP for connected VLANs."
                  )}
                >
                  <Icon name="information" />
                </Tooltip>
              </>
            }
          >
            {controllersLoading ? (
              <Spinner />
            ) : (
              controllers.map((controller) =>
                controller ? (
                  <ControllerLink key={controller.system_id} {...controller} />
                ) : null
              )
            )}
          </Definition>
        </Col>
      </Row>
    </Strip>
  );
};

export default VLANSummary;
