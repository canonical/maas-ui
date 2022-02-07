import { useState } from "react";

import {
  Col,
  Input,
  Notification,
  Row,
  Select,
} from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { ConfigureDHCPValues } from "../ConfigureDHCP";

import FormikField from "app/base/components/FormikField";
import controllerSelectors from "app/store/controller/selectors";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getFullVLANName } from "app/store/vlan/utils";
import { isId } from "app/utils";

enum DHCPType {
  CONTROLLERS = "controllers",
  RELAY = "relay",
}

type Props = {
  vlan: VLAN;
};

const ConfigureDHCPFields = ({ vlan }: Props): JSX.Element => {
  const {
    setFieldValue,
    values: { primaryRack, secondaryRack },
  } = useFormikContext<ConfigureDHCPValues>();
  const fabrics = useSelector(fabricSelectors.all);
  const allVLANs = useSelector(vlanSelectors.all);
  const vlansWithDHCP = useSelector(vlanSelectors.getWithDHCP).filter(
    (dhcpVLAN) => dhcpVLAN.id !== vlan.id
  );
  const connectedControllers = useSelector((state: RootState) =>
    controllerSelectors.getByIDs(state, vlan.rack_sids)
  );
  const [enableDHCP, setEnableDHCP] = useState(true);
  const [dhcpType, setDHCPType] = useState<DHCPType>(
    isId(vlan.relay_vlan) ? DHCPType.RELAY : DHCPType.CONTROLLERS
  );
  const primaryRackOptions = connectedControllers.filter(
    (controller) => controller.system_id !== secondaryRack
  );
  const secondaryRackOptions = connectedControllers.filter(
    (controller) => controller.system_id !== primaryRack
  );

  return (
    <Row>
      <Col size={6}>
        <Input
          checked={enableDHCP}
          id="enable-dhcp"
          label="MAAS provides DHCP"
          name="enableDHCP"
          onChange={() => {
            setEnableDHCP(!enableDHCP);
            setFieldValue("primaryRack", "");
            setFieldValue("relayVLAN", "");
            setFieldValue("secondaryRack", "");
          }}
          type="checkbox"
        />
        {enableDHCP && (
          <>
            <Input
              checked={dhcpType === DHCPType.CONTROLLERS}
              id="controller-dhcp"
              label="Provide DHCP from rack controller(s)"
              name="dhcpType"
              onChange={() => {
                setDHCPType(DHCPType.CONTROLLERS);
                setFieldValue(
                  "primaryRack",
                  connectedControllers[0]?.system_id || ""
                );
                setFieldValue("relayVLAN", "");
              }}
              type="radio"
              value={DHCPType.CONTROLLERS}
            />
            {dhcpType === DHCPType.CONTROLLERS && (
              <>
                {connectedControllers.length === 0 ? (
                  <Notification severity="negative">
                    This VLAN is not currently being utilised on any rack
                    controller.
                  </Notification>
                ) : (
                  <>
                    <FormikField
                      component={Select}
                      label={
                        connectedControllers.length === 1
                          ? "Rack controller"
                          : "Primary rack"
                      }
                      name="primaryRack"
                      options={primaryRackOptions.map((controller) => ({
                        label: controller.hostname,
                        value: controller.system_id,
                      }))}
                      wrapperClassName="u-nudge-right--x-large"
                    />
                    {connectedControllers.length > 1 && (
                      <FormikField
                        component={Select}
                        label="Secondary rack"
                        name="secondaryRack"
                        options={[
                          { label: "Unset", value: "" },
                          ...secondaryRackOptions.map((controller) => ({
                            label: controller.hostname,
                            value: controller.system_id,
                          })),
                        ]}
                        wrapperClassName="u-nudge-right--x-large"
                      />
                    )}
                  </>
                )}
              </>
            )}
            <Input
              checked={dhcpType === DHCPType.RELAY}
              id="relay-dhcp"
              label="Relay to another VLAN"
              name="dhcpType"
              onChange={() => {
                setDHCPType(DHCPType.RELAY);
                setFieldValue("relayVLAN", vlansWithDHCP[0]?.id || "");
                setFieldValue("primaryRack", "");
                setFieldValue("secondaryRack", "");
              }}
              type="radio"
              value={DHCPType.RELAY}
            />
            {dhcpType === DHCPType.RELAY && (
              <FormikField
                component={Select}
                label="VLAN"
                name="relayVLAN"
                options={vlansWithDHCP.map((dhcpVLAN) => ({
                  label:
                    getFullVLANName(dhcpVLAN.id, allVLANs, fabrics) ||
                    dhcpVLAN.name,
                  value: dhcpVLAN.id,
                }))}
                wrapperClassName="u-nudge-right--x-large"
              />
            )}
          </>
        )}
      </Col>
      {!enableDHCP && (
        <Notification severity="caution">
          Are you sure you want to disable DHCP on this VLAN? All subnets on
          this VLAN will be affected.
        </Notification>
      )}
    </Row>
  );
};

export default ConfigureDHCPFields;
