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
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { ComposeFormValues, InterfaceField } from "../ComposeForm";
import type { PodDetails } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { Space } from "app/store/space/types";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";
import fabricSelectors from "app/store/fabric/selectors";
import podSelectors from "app/store/pod/selectors";
import spaceSelectors from "app/store/space/selectors";
import subnetSelectors from "app/store/subnet/selectors";
import vlanSelectors from "app/store/vlan/selectors";
import FormikField from "app/base/components/FormikField";
import TableActions from "app/base/components/TableActions";

/**
 * Filter subnets to those that are in a given space.
 * @param {Subnet[]} subnets - The subnets to filter.
 * @param {Space} space - The space by which to filter subnets.
 * @returns {Subnet[]} Subnets filtered by space.
 */
const filterSubnetsBySpace = (subnets: Subnet[], space: Space): Subnet[] => {
  if (!!space) {
    return subnets.filter((subnet) => subnet.space === space.id);
  }
  return subnets;
};

/**
 * Generate a new InterfaceField with a given id.
 * @param {number} id - The id to give the new InterfaceField.
 * @returns {InterfaceField} Generated InterfaceField.
 */
const generateNewInterface = (id: number): InterfaceField => {
  return {
    id,
    ipAddress: "",
    name: `eth${id}`,
    space: "",
    subnet: "",
  };
};

/**
 * Get the icon class name for the interface's PXE column.
 * @param {PodDetails} pod - The pod whose boot VLANs are to be checked.
 * @param {VLAN} vlan - The VLAN of the interface's selected subnet.
 * @returns {string} The class name of the PXE column icon.
 */
const getPxeIconClass = (pod: PodDetails, vlan: VLAN): string => {
  if (!vlan || !pod) {
    return "p-icon--power-unknown";
  }
  return pod.boot_vlans?.includes(vlan.id)
    ? "p-icon--success"
    : "p-icon--error";
};

export const InterfacesTable = (): JSX.Element => {
  const { id } = useParams();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  ) as PodDetails;
  const podSubnets = useSelector((state: RootState) =>
    subnetSelectors.getByPod(state, pod)
  );
  const composingPods = useSelector(podSelectors.composing);
  const fabrics = useSelector(fabricSelectors.all);
  const spaces = useSelector(spaceSelectors.all);
  const vlans = useSelector(vlanSelectors.all);

  const { handleChange, setFieldValue, values } = useFormikContext<
    ComposeFormValues
  >();
  const { interfaces } = values;
  const cannotDefineInterfaces = podSubnets.length === 0;

  const addInterface = () => {
    const ids = interfaces.map((iface) => iface.id);
    let id = 0;
    while (ids.includes(id)) {
      id++;
    }
    setFieldValue("interfaces", [...interfaces, generateNewInterface(id)]);
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
          disabled={cannotDefineInterfaces || !!composingPods.length}
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
      <Table className="kvm-compose-interfaces-table" responsive>
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
              const space = spaces.find(
                (space) => space.id === Number(iface.space)
              );
              const subnet = podSubnets.find(
                (subnet) => subnet.id === Number(iface.subnet)
              );
              const vlan = vlans.find((vlan) => vlan.id === subnet?.vlan);
              const fabric = fabrics.find(
                (fabric) => fabric.id === vlan?.fabric
              );
              const subnetsBySpace = filterSubnetsBySpace(podSubnets, space);

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
                    <FormikField
                      className="u-no-margin--bottom"
                      component={Select}
                      name={`interfaces[${i}].subnet`}
                      options={[
                        {
                          label: "Any",
                          value: "",
                        },
                        ...subnetsBySpace.map((subnet) => ({
                          key: subnet.id,
                          label: subnet.name,
                          value: subnet.id,
                        })),
                      ]}
                    />
                  </TableCell>
                  <TableCell aria-label="Fabric">
                    {fabric?.name || <em>Auto-assign</em>}
                  </TableCell>
                  <TableCell aria-label="VLAN">
                    {vlan?.name || <em>Auto-assign</em>}
                  </TableCell>
                  <TableCell aria-label="PXE">
                    <i className={getPxeIconClass(pod, vlan)}></i>
                  </TableCell>
                  <TableCell
                    aria-label="Actions"
                    className="u-align--right u-no-padding--right"
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
              <TableCell aria-label="IP address" colSpan="7">
                Created by hypervisor at compose time
              </TableCell>
            </TableRow>
          </tbody>
        )}
      </Table>
      <Tooltip
        data-test="define-interfaces"
        message={
          cannotDefineInterfaces &&
          "There are no available subnets on this KVM's attached VLANs."
        }
        position="right"
      >
        <Button
          className="u-hide--small"
          disabled={cannotDefineInterfaces || !!composingPods.length}
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
