import { Col, Icon, Row, Select, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { DiscoveryAddValues } from "../types";
import { DeviceType } from "../types";

import FormikField from "app/base/components/FormikField";
import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import deviceSelectors from "app/store/device/selectors";
import { DeviceIpAssignment, DeviceMeta } from "app/store/device/types";
import { getIpAssignmentDisplay } from "app/store/device/utils";
import type { Discovery } from "app/store/discovery/types";
import domainSelectors from "app/store/domain/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import { getSubnetDisplay } from "app/store/subnet/utils";
import { NodeStatusCode } from "app/store/types/node";
import vlanSelectors from "app/store/vlan/selectors";
import { getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  discovery: Discovery;
};

const DiscoveryAddFormFields = ({ discovery }: Props): JSX.Element | null => {
  const devices = useSelector(deviceSelectors.all);
  const domains = useSelector(domainSelectors.all);
  const machines = useSelector((state: RootState) =>
    machineSelectors.getByStatusCode(state, NodeStatusCode.DEPLOYED)
  );
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getByCIDR(state, discovery.subnet_cidr)
  );
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, discovery.vlan)
  );
  const { values } = useFormikContext<DiscoveryAddValues>();
  const isDevice = values.type === DeviceType.DEVICE;
  const isInterface = values.type === DeviceType.INTERFACE;
  // Only include static when the discovery has a subnet.
  const includeStatic = discovery.subnet || discovery.subnet === 0;
  const subnetDisplay = getSubnetDisplay(subnet);
  const vlanDisplay = getVLANDisplay(vlan);

  return (
    <>
      <Row>
        <Col size={6}>
          <FormikField
            component={Select}
            label="Type"
            name="type"
            options={[
              { label: "Choose type", value: "", disabled: true },
              { label: "Device", value: DeviceType.DEVICE },
              { label: "Interface", value: DeviceType.INTERFACE },
            ]}
            required
          />
          <FormikField
            label={`${isDevice ? "Hostname" : "Interface name"} (optional)`}
            name="hostname"
            type="text"
          />
          {isDevice ? (
            <FormikField
              component={Select}
              label="Domain"
              name="domain"
              options={[
                { label: "Choose domain", value: "", disabled: true },
                ...domains.map((domain) => ({
                  label: domain.name,
                  value: domain.name,
                })),
              ]}
              required
            />
          ) : null}
          {isInterface ? (
            <FormikField
              component={Select}
              label={
                <>
                  Device name{" "}
                  <Tooltip message="Create as an interface on the selected device.">
                    <Icon name="information" />
                  </Tooltip>
                </>
              }
              name={DeviceMeta.PK}
              options={[
                { label: "Select device name", value: "", disabled: true },
                ...devices.map((device) => ({
                  label: device.fqdn,
                  value: device[DeviceMeta.PK],
                })),
              ]}
              required
            />
          ) : (
            <FormikField
              component={Select}
              label={
                <>
                  Parent{" "}
                  <Tooltip message="Assign this device as a child of the parent machine.">
                    <Icon name="information" />
                  </Tooltip>
                </>
              }
              name="parent"
              options={[
                { label: "Select parent (optional)", value: "" },
                ...machines.map((machine) => ({
                  label: machine.fqdn,
                  value: machine.system_id,
                })),
              ]}
            />
          )}
        </Col>
        <Col size={6}>
          <FormikField
            component={Select}
            label="IP assignment"
            name="ip_assignment"
            options={[
              { label: "Select IP assignment", value: "", disabled: true },
              {
                label: getIpAssignmentDisplay(DeviceIpAssignment.DYNAMIC),
                value: DeviceIpAssignment.DYNAMIC,
              },
              ...(includeStatic
                ? [
                    {
                      label: getIpAssignmentDisplay(DeviceIpAssignment.STATIC),
                      value: DeviceIpAssignment.STATIC,
                    },
                  ]
                : []),
              {
                label: getIpAssignmentDisplay(DeviceIpAssignment.EXTERNAL),
                value: DeviceIpAssignment.EXTERNAL,
              },
            ]}
            required
          />
          <div className="">
            <p>Fabric</p>
            <p>
              <LegacyLink route={baseURLs.fabric({ id: discovery.fabric })}>
                {discovery.fabric_name}
              </LegacyLink>
            </p>
          </div>
          <div className="u-nudge-down--small">
            <p>VLAN</p>
            <p>
              {vlanDisplay ? (
                <LegacyLink route={baseURLs.vlan({ id: discovery.vlan })}>
                  {vlanDisplay}
                </LegacyLink>
              ) : null}
            </p>
          </div>
          <div className="u-nudge-down--small">
            <p>Subnet</p>
            {discovery.subnet && subnetDisplay ? (
              <p>
                <LegacyLink route={baseURLs.subnet({ id: discovery.subnet })}>
                  {subnetDisplay}
                </LegacyLink>
              </p>
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DiscoveryAddFormFields;
