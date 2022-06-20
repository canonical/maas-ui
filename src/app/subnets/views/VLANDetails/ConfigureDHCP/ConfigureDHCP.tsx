import { useCallback, useEffect } from "react";

import { Card, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ConfigureDHCPFields from "./ConfigureDHCPFields";
import DHCPReservedRanges from "./DHCPReservedRanges";

import FormikForm from "app/base/components/FormikForm";
import TitledSection from "app/base/components/TitledSection";
import docsUrls from "app/base/docsUrls";
import { useCycled } from "app/base/hooks";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { ConfigureDHCPParams, VLAN, VLANMeta } from "app/store/vlan/types";
import { isId } from "app/utils";

type Props = {
  closeForm: () => void;
  id?: VLAN[VLANMeta.PK] | null;
};

export enum DHCPType {
  CONTROLLERS = "controllers",
  RELAY = "relay",
}

export type ConfigureDHCPValues = {
  dhcpType: "controllers" | "relay";
  enableDHCP: boolean;
  endIP: string;
  gatewayIP: string;
  primaryRack: Controller[ControllerMeta.PK];
  relayVLAN: VLAN[VLANMeta.PK] | "";
  secondaryRack: Controller[ControllerMeta.PK];
  startIP: string;
  subnet: Subnet[SubnetMeta.PK] | "";
};

const ConfigureDHCP = ({ closeForm, id }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const controllersLoading = useSelector(controllerSelectors.loading);
  const fabricsLoading = useSelector(fabricSelectors.loading);
  const ipRangesLoading = useSelector(ipRangeSelectors.loading);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const vlansLoading = useSelector(vlanSelectors.loading);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const configuringDHCP = useSelector((state: RootState) =>
    vlanSelectors.getStatusForVLAN(state, id, "configuringDHCP")
  );
  const configureDHCPError = useSelector((state: RootState) =>
    vlanSelectors.eventErrorsForVLANs(state, id, "configureDHCP")
  )[0]?.error;
  const [configuredDHCP, resetConfiguredDHCP] = useCycled(!configuringDHCP);
  const saved = configuredDHCP && !configureDHCPError;
  const cleanup = useCallback(() => vlanActions.cleanup(), []);
  const loading =
    !vlan ||
    controllersLoading ||
    fabricsLoading ||
    ipRangesLoading ||
    subnetsLoading ||
    vlansLoading;

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(fabricActions.fetch());
    dispatch(ipRangeActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  const Schema = Yup.object()
    .shape({
      dhcpType: Yup.string().oneOf([DHCPType.CONTROLLERS, DHCPType.RELAY]),
      enableDHCP: Yup.boolean(),
      endIP: Yup.string().when("subnet", {
        is: (val: string) => isId(val),
        then: Yup.string().required("End IP address is required"),
      }),
      gatewayIP: Yup.string(),
      primaryRack: Yup.string(),
      relayVLAN: Yup.string(),
      secondaryRack: Yup.string(),
      startIP: Yup.string().when("subnet", {
        is: (val: string) => isId(val),
        then: Yup.string().required("Start IP address is required"),
      }),
      subnet: Yup.string().test(
        "hasNoIPs",
        "Selected subnet has not available IPs",
        (subnetId, context) => {
          if (isId(subnetId)) {
            const subnet = subnets.find(
              (subnet) => subnet.id === Number(subnetId)
            );
            if (subnet?.statistics.num_available === 0) {
              return context.createError({
                message: "This subnet has no available IP addresses.",
                path: "subnet",
              });
            }
          }
          return true;
        }
      ),
    })
    .test("invalidConfig", "Invalid DHCP configuration", (values, context) => {
      const { enableDHCP, primaryRack, relayVLAN } = values;
      if (enableDHCP && !isId(primaryRack) && !isId(relayVLAN)) {
        return context.createError({
          message:
            "Configuration needs at least one rack controller or a relay VLAN.",
          path: "hidden",
        });
      }
      return true;
    });

  return (
    <Card>
      <TitledSection className="u-no-padding" title="Configure DHCP">
        {loading ? (
          <span data-testid="loading-data">
            <Spinner text="Loading..." />
          </span>
        ) : (
          <FormikForm<ConfigureDHCPValues>
            allowUnchanged
            buttonsHelp={
              <a href={docsUrls.dhcp} rel="noreferrer noopener" target="_blank">
                About DHCP
              </a>
            }
            cleanup={cleanup}
            errors={configureDHCPError}
            initialValues={{
              dhcpType: isId(vlan.relay_vlan)
                ? DHCPType.RELAY
                : DHCPType.CONTROLLERS,
              enableDHCP: true,
              endIP: "",
              gatewayIP: "",
              primaryRack: vlan.primary_rack || "",
              relayVLAN: vlan.relay_vlan || "",
              secondaryRack: vlan.secondary_rack || "",
              startIP: "",
              subnet: "",
            }}
            onCancel={closeForm}
            onSaveAnalytics={{
              action: "Configure DHCP",
              category: "VLAN details",
              label: "Configure DHCP form",
            }}
            onSubmit={(values) => {
              resetConfiguredDHCP();
              dispatch(cleanup());
              const { enableDHCP, primaryRack, relayVLAN, secondaryRack } =
                values;
              const params: ConfigureDHCPParams = {
                controllers: [],
                id: vlan.id,
                relay_vlan: null,
              };
              if (enableDHCP) {
                if (primaryRack) {
                  params.controllers.push(primaryRack);
                }
                if (secondaryRack) {
                  params.controllers.push(secondaryRack);
                }
                if (isId(relayVLAN)) {
                  params.relay_vlan = Number(relayVLAN);
                }
                if (isId(values.subnet)) {
                  params.extra = {
                    end: values.endIP,
                    gateway: values.gatewayIP,
                    start: values.startIP,
                    subnet: Number(values.subnet),
                  };
                }
              }
              dispatch(vlanActions.configureDHCP(params));
            }}
            onSuccess={() => closeForm()}
            saved={saved}
            saving={configuringDHCP}
            submitLabel="Configure DHCP"
            validateOnMount
            validationSchema={Schema}
          >
            <ConfigureDHCPFields vlan={vlan} />
            <DHCPReservedRanges id={vlan.id} />
          </FormikForm>
        )}
      </TitledSection>
    </Card>
  );
};

export default ConfigureDHCP;
