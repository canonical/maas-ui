import React from "react";

import { ContextualMenu } from "@canonical/react-components";
import { Link } from "react-router-dom";

type Props = {
  disabled?: boolean;
};

export const AddHardwareMenu = ({ disabled = false }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="add-hardware-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Machine",
          element: Link,
          to: "/machines/add",
        },
        {
          children: "Chassis",
          element: Link,
          to: "/machines/chassis/add",
        },
        {
          children: "RSD",
          element: Link,
          to: "/machines/rsd/add",
        },
      ]}
      position="right"
      toggleAppearance="neutral"
      toggleDisabled={disabled}
      toggleLabel="Add hardware"
    />
  );
};

export default AddHardwareMenu;
