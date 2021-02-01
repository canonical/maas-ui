import { Fragment, useEffect } from "react";

import { Card, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { SetSelectedAction } from "../../types";
import TestResults from "../TestResults";

import NetworkCardTable from "./NetworkCardTable";

import LegacyLink from "app/base/components/LegacyLink";
import { HardwareType } from "app/base/enum";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type InterfaceGroup = {
  firmwareVersion: string;
  interfaces: NetworkInterface[];
  product: string;
  vendor: string;
};

type Props = {
  id: Machine["system_id"];
  setSelectedAction: SetSelectedAction;
};

/**
 * Group physical interfaces by vendor, product and firmware version.
 * @param interfaces - the interfaces to group
 * @returns interfaces grouped by vendor, product and firmware version
 */
const groupInterfaces = (interfaces: NetworkInterface[]): InterfaceGroup[] => {
  const physicalInterfaces = interfaces.filter(
    (iface) => iface.type === "physical"
  );

  // Group interfaces by vendor, product and firmware version
  const interfaceGroups = physicalInterfaces.reduce(
    (groups: InterfaceGroup[], iface: NetworkInterface) => {
      const vendor = iface.vendor || "Unknown network card";
      const product = iface.product || "";
      const firmwareVersion = iface.firmware_version || "";
      const existingGroup = groups.find(
        (group) =>
          group.vendor === vendor &&
          group.product === product &&
          group.firmwareVersion === firmwareVersion
      );

      if (existingGroup) {
        existingGroup.interfaces.push(iface);
      } else {
        groups.push({
          interfaces: [iface],
          vendor,
          product,
          firmwareVersion,
        });
      }
      return groups;
    },
    []
  );

  // Sort groups by vendor, then product, then firmware version. Unknown vendors
  // should appear last.
  const sortedGroups = interfaceGroups.sort((a, b) => {
    const vendorA = a.vendor;
    const vendorB = b.vendor;
    const productA = a.product;
    const productB = b.product;
    const versionA = a.firmwareVersion;
    const versionB = b.firmwareVersion;

    if (vendorA === "Unknown network card") {
      return 1;
    }
    if (vendorB === "Unknown network card") {
      return -1;
    }
    if (vendorA === vendorB) {
      if (productA === productB) {
        if (versionA === versionB) {
          return 0;
        }
        return versionA > versionB ? 1 : -1;
      }
      return productA > productB ? 1 : -1;
    }
    return vendorA > vendorB ? 1 : -1;
  });

  return sortedGroups;
};

const NetworkCard = ({ id, setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  let content: JSX.Element;
  const networkRoute = `/machine/${id}?area=network`;

  // Confirm that the full machine details have been fetched. This also allows
  // TypeScript know we're using the right union type (otherwise it will
  // complain that interfaces doesn't exist on the base machine type).
  if (machine && "interfaces" in machine && fabricsLoaded && vlansLoaded) {
    const groupedInterfaces = groupInterfaces(machine.interfaces);
    content = (
      <>
        {groupedInterfaces.map((group, i) => (
          <Fragment key={i}>
            <ul className="p-inline-list u-no-margin--bottom">
              <li className="p-inline-list__item" data-test="nic-vendor">
                {group.vendor}
              </li>
              {group.product && (
                <li
                  className="p-inline-list__item u-text--muted"
                  data-test="nic-product"
                >
                  {group.product}
                </li>
              )}
              {group.firmwareVersion && (
                <li
                  className="p-inline-list__item u-text--muted"
                  data-test="nic-firmware-version"
                >
                  {group.firmwareVersion}
                </li>
              )}
            </ul>
            <NetworkCardTable interfaces={group.interfaces} />
          </Fragment>
        ))}
        <p>
          Information about tagged traffic can be seen in the{" "}
          <LegacyLink route={networkRoute}>Network tab</LegacyLink>.
        </p>
        <TestResults
          machine={machine}
          hardwareType={HardwareType.Network}
          setSelectedAction={setSelectedAction}
        />
      </>
    );
  } else {
    content = <Spinner />;
  }

  return (
    <div className="machine-summary__network-card">
      <Card>
        <h4 className="p-muted-heading u-sv1">
          <LegacyLink route={networkRoute}>Network&nbsp;&rsaquo;</LegacyLink>
        </h4>
        {content}
      </Card>
    </div>
  );
};

export default NetworkCard;
