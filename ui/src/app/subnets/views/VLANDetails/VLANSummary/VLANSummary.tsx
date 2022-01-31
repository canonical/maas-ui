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
import { Link } from "react-router-dom";

import ControllerLink from "app/base/components/ControllerLink";
import Definition from "app/base/components/Definition";
import controllerSelectors from "app/store/controller/selectors";
import fabricSelectors from "app/store/fabric/selectors";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { RootState } from "app/store/root/types";
import spaceSelectors from "app/store/space/selectors";
import { getSpaceDisplay } from "app/store/space/utils";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import subnetsURLs from "app/subnets/urls";
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
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, vlan?.fabric)
  );
  const fabricsLoading = useSelector(fabricSelectors.loading);
  const space = useSelector((state: RootState) =>
    spaceSelectors.getById(state, vlan?.space)
  );
  const spacesLoading = useSelector(spaceSelectors.loading);

  if (!vlan) {
    return null;
  }

  const fabricDisplay = getFabricDisplay(fabric);
  const spaceDisplay = getSpaceDisplay(space);
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
            {spacesLoading ? (
              <Spinner />
            ) : space ? (
              <Link
                data-testid="space-link"
                to={subnetsURLs.space.index({ id: space.id })}
              >
                {spaceDisplay}
              </Link>
            ) : (
              spaceDisplay
            )}
          </Definition>
          <Definition label="Fabric">
            {fabricsLoading ? (
              <Spinner />
            ) : fabric ? (
              <Link
                data-testid="fabric-link"
                to={subnetsURLs.fabric.index({ id: fabric.id })}
              >
                {fabricDisplay}
              </Link>
            ) : (
              fabricDisplay
            )}
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
