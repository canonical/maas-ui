import * as React from "react";

import {
  Button,
  Select,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Tooltip,
} from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { ComposeFormValues, InterfaceField } from "../ComposeForm";

import SubnetSelect from "./SubnetSelect";

import FormikField from "app/base/components/FormikField";
import TableActions from "app/base/components/TableActions";
import type { RouteParams } from "app/base/types";
import fabricSelectors from "app/store/fabric/selectors";
import podSelectors from "app/store/pod/selectors";
import type { PodDetails } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import spaceSelectors from "app/store/space/selectors";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";

/**
 * Generate a new InterfaceField with a given id and preselected subnet.
 * @param id - The id to give the new InterfaceField.
 * @param subnetId - The id of the subnet that the new interface should belong to.
 * @returns Generated InterfaceField.
 */
const generateNewInterface = (
  id: number,
  subnetId?: Subnet["id"]
): InterfaceField => {
  return {
    id,
    ipAddress: "",
    name: `eth${id}`,
    space: "",
    subnet: `${subnetId || ""}`,
  };
};

/**
 * Get the icon class name for the interface's PXE column.
 * @param pod - The pod whose boot VLANs are to be checked.
 * @param vlan - The VLAN of the interface's selected subnet.
 * @returns The class name of the PXE column icon.
 */
export const getPxeIconClass = (pod: PodDetails, vlan: VLAN): string => {
  if (!vlan || !pod) {
    return "p-icon--placeholder";
  }
  return pod.boot_vlans?.includes(vlan.id)
    ? "p-icon--success"
    : "p-icon--error";
};

/**
 * Generate tooltip message for disabled "Define" interfaces button.
 * @param hasSubnets - Whether the pod has any subnets on its attached VLANs.
 * @param hasPxeSubnets - Whether the pod has any subnets on its boot VLANs.
 * @returns Tooltip message for disabled button.
 */
const getTooltipMessage = (hasSubnets: boolean, hasPxeSubnets: boolean) => {
  if (!hasSubnets) {
    return "There are no available networks seen by this VM host.";
  }
  if (!hasPxeSubnets) {
    return "There are no PXE-enabled networks seen by this VM host.";
  }
  return null;
};

export const InterfacesTable = (): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  ) as PodDetails;
  const allPodSubnets = useSelector((state: RootState) =>
    subnetSelectors.getByPod(state, pod)
  );
  const pxeSubnets = useSelector((state: RootState) =>
    subnetSelectors.getPxeEnabledByPod(state, pod)
  );
  const composingPods = useSelector(podSelectors.composing);
  const fabrics = useSelector(fabricSelectors.all);
  const spaces = useSelector(spaceSelectors.all);
  const vlans = useSelector(vlanSelectors.all);

  const { handleChange, setFieldValue, values } =
    useFormikContext<ComposeFormValues>();
  const { interfaces } = values;
  const hasSubnets = allPodSubnets.length >= 1;
  const hasPxeSubnets = pxeSubnets.length >= 1;
  const canDefineInterfaces =
    hasSubnets && hasPxeSubnets && !composingPods.length;
  const firstPxeSubnet = hasPxeSubnets ? pxeSubnets[0] : null;

  const addInterface = () => {
    const ids = interfaces.map((iface) => iface.id);
    let id = 0;
    while (ids.includes(id)) {
      id++;
    }
    setFieldValue("interfaces", [
      ...interfaces,
      generateNewInterface(id, firstPxeSubnet?.id),
    ]);
  };

  const removeInterface = (id: number) => {
    setFieldValue(
      "interfaces",
      interfaces.filter((iface) => iface.id !== id)
    );
  };

  return (
    <>
      <div className="u-flex--between">
        <h4>Interfaces</h4>
        <Button
          className="u-hide--medium u-hide--large"
          disabled={!canDefineInterfaces}
          hasIcon
          onClick={addInterface}
          type="button"
        >
          <i className="p-icon--plus"></i>
          <span>
            {interfaces.length === 0 ? "Define (optional)" : "Add interface"}
          </span>
        </Button>
      </div>
      <Table className="kvm-compose-interfaces-table p-form--table" responsive>
        <thead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>IP address</TableHeader>
            <TableHeader>Space</TableHeader>
            <TableHeader>Subnet</TableHeader>
            <TableHeader>Fabric</TableHeader>
            <TableHeader>VLAN</TableHeader>
            <TableHeader>PXE</TableHeader>
            <TableHeader className="u-align--right">Actions</TableHeader>
          </TableRow>
        </thead>
        {interfaces.length >= 1 ? (
          <tbody>
            {interfaces.map((iface, i) => {
              const subnet = allPodSubnets.find(
                (subnet) => subnet.id === parseInt(iface.subnet)
              );
              const vlan = vlans.find((vlan) => vlan.id === subnet?.vlan);
              const fabric = fabrics.find(
                (fabric) => fabric.id === vlan?.fabric
              );

              return (
                <TableRow key={iface.id}>
                  <TableCell aria-label="Name">
                    <FormikField name={`interfaces[${i}].name`} type="text" />
                  </TableCell>
                  <TableCell aria-label="IP address">
                    <FormikField
                      name={`interfaces[${i}].ipAddress`}
                      placeholder="Leave empty to auto-assign"
                      type="text"
                    />
                  </TableCell>
                  <TableCell aria-label="Space">
                    <FormikField
                      component={Select}
                      name={`interfaces[${i}].space`}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        handleChange(e);
                        setFieldValue(`interfaces[${i}].subnet`, "");
                      }}
                      options={[
                        {
                          label: "Any",
                          value: "",
                        },
                        ...spaces.map((space) => ({
                          key: space.id,
                          label: space.name,
                          value: space.id,
                        })),
                      ]}
                    />
                  </TableCell>
                  <TableCell aria-label="Subnet">
                    <SubnetSelect
                      iface={iface}
                      index={i}
                      selectSubnet={(subnetID: number) => {
                        setFieldValue(`interfaces[${i}].subnet`, subnetID);
                      }}
                    />
                  </TableCell>
                  <TableCell aria-label="Fabric" className="u-align-non-field">
                    {fabric?.name || ""}
                  </TableCell>
                  <TableCell aria-label="VLAN" className="u-align-non-field">
                    {vlan?.name || ""}
                  </TableCell>
                  <TableCell aria-label="PXE" className="u-align-non-field">
                    <i className={getPxeIconClass(pod, vlan)}></i>
                  </TableCell>
                  <TableCell
                    aria-label="Actions"
                    className="u-align--right u-no-padding--right u-align-non-field"
                  >
                    <TableActions
                      deleteDisabled={!!composingPods.length}
                      onDelete={() => removeInterface(iface.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <TableRow data-test="undefined-interface">
              <TableCell aria-label="Name">
                <em>default</em>
              </TableCell>
              <TableCell aria-label="IP address" colSpan={7}>
                Created by hypervisor at compose time
              </TableCell>
            </TableRow>
          </tbody>
        )}
      </Table>
      <Tooltip
        data-test="define-interfaces"
        message={getTooltipMessage(hasSubnets, hasPxeSubnets)}
        position="right"
      >
        <Button
          className="u-hide--small"
          disabled={!canDefineInterfaces}
          hasIcon
          onClick={addInterface}
          type="button"
        >
          <i className="p-icon--plus"></i>
          <span>
            {interfaces.length === 0 ? "Define (optional)" : "Add interface"}
          </span>
        </Button>
      </Tooltip>
    </>
  );
};

export default InterfacesTable;
