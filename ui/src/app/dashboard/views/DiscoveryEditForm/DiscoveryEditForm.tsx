import { useState } from "react";

import { Input, Row, Col, Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import type { Device } from "app/store/device/types";
import type { Discovery } from "app/store/discovery/types";
import type { Domain } from "app/store/domain/types";
import type { Machine } from "app/store/machine/types";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";

type Props = {
  discovery: Discovery;
  domains: Domain[];
  subnet: Subnet;
  vlan: VLAN;
  machines: Machine[];
  devices: Device[];
};

const DiscoveryEditForm = ({
  discovery,
  domains,
  subnet,
  vlan,
  machines,
  devices,
}: Props): JSX.Element => {
  const [type, setType] = useState("device");

  return (
    <Row>
      <Col size="12">
        <FormikForm
          initialValues={{
            hostname: discovery.hostname || "",
            type: "",
            domain: "",
            "device-name": "",
            ip: "",
            parent: "",
          }}
          onSubmit={() => {
            // do something
          }}
        >
          <Row>
            <Col size="6">
              <FormikField
                component={Input}
                name="hostname"
                type="text"
                placeholder="Hostname (optional)"
              />
            </Col>
          </Row>

          <Row>
            <Col size="6">
              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">MAC</label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <span className="u-control-text">
                      {discovery.mac_address}
                    </span>
                  </div>
                </Col>
              </Row>

              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">IP</label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <span className="u-control-text">{discovery.ip}</span>
                  </div>
                </Col>
              </Row>

              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">Rack</label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <span className="u-control-text">
                      {discovery.observer_hostname}
                    </span>
                  </div>
                </Col>
              </Row>

              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">
                    Last seen
                  </label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <span className="u-control-text">
                      {discovery.last_seen}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col size="6">
              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">
                    Fabric
                  </label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <LegacyLink
                      route={baseURLs.fabric({
                        id: discovery.fabric,
                      })}
                      className="u-control-text"
                    >
                      {discovery.fabric_name}
                    </LegacyLink>
                  </div>
                </Col>
              </Row>

              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">VLAN</label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <LegacyLink
                      route={baseURLs.vlan({ id: discovery.vlan })}
                      className="u-control-text"
                    >
                      {vlan.vid === 0
                        ? "untagged"
                        : `${vlan.vid} (${vlan.name})`}
                    </LegacyLink>
                  </div>
                </Col>
              </Row>

              <Row className="p-form__group">
                <Col size="2">
                  <label className="p-form__label u-disabled-text">
                    Subnet
                  </label>
                </Col>
                <Col size="4">
                  <div className="p-form__control">
                    <LegacyLink
                      route={baseURLs.subnet({
                        id: discovery.subnet,
                      })}
                      className="u-control-text"
                    >
                      {discovery.subnet_cidr} ({subnet.name})
                    </LegacyLink>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col size="6">
              <FormikField
                name="type"
                label="Type"
                component={Select}
                options={[
                  { label: "Choose type", value: "", disabled: true },
                  { label: "Device", value: "device" },
                  { label: "Interface", value: "interface" },
                ]}
                onChange={(e) => setType(e.target.value)}
              />
              {type === "device" ? (
                <FormikField
                  name="domain"
                  label="Domain"
                  component={Select}
                  options={[
                    { label: "Choose domain", value: "", disabled: true },
                    ...domains.map((domain) => {
                      return {
                        label: domain.name,
                        value: domain.name,
                      };
                    }),
                  ]}
                />
              ) : null}

              {type === "interface" ? (
                <FormikField
                  name="device-name"
                  label="Device name"
                  component={Select}
                  options={[
                    { label: "Select device name", value: "", disabled: true },
                    ...devices.map((device) => {
                      return {
                        label: device.fqdn,
                        value: device.fqdn,
                      };
                    }),
                  ]}
                />
              ) : null}
            </Col>
            <Col size="6">
              <FormikField
                name="ip"
                label="IP assignment"
                component={Select}
                options={[
                  { label: "Select IP assignment", value: "", disabled: true },
                  { label: "Static", value: "static" },
                  { label: "Dynamic", value: "dynamic" },
                  { label: "External", value: "external" },
                ]}
              />
              {type === "device" ? (
                <FormikField
                  name="parent"
                  label="Parent"
                  component={Select}
                  options={[
                    { label: "Select parent (optional)", value: "" },
                    ...machines.map((machine) => {
                      return {
                        label: machine.fqdn,
                        value: machine.system_id,
                      };
                    }),
                  ]}
                />
              ) : null}
            </Col>
          </Row>
        </FormikForm>
      </Col>
    </Row>
  );
};

export default DiscoveryEditForm;
