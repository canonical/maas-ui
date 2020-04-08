import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { general as generalActions } from "app/base/actions";
import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";
import ContextualMenu from "app/base/components/ContextualMenu";

const getAddHardwareLinks = (navigationOptions) => {
  const links = [
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
  ];

  return navigationOptions.rsd
    ? links.concat({
        children: "RSD",
        element: "a",
        href: `${process.env.REACT_APP_ANGULAR_BASENAME}/rsd`,
      })
    : links;
};

export const AddHardwareMenu = () => {
  const dispatch = useDispatch();
  const navigationOptions = useSelector(generalSelectors.navigationOptions.get);
  const selectedIds = useSelector(machineSelectors.selectedIDs);
  const hasSelectedMachines = selectedIds.length > 0;

  useEffect(() => {
    dispatch(generalActions.fetchNavigationOptions());
  }, [dispatch]);

  return (
    <ContextualMenu
      data-test="add-hardware-dropdown"
      hasToggleIcon
      links={getAddHardwareLinks(navigationOptions)}
      position="right"
      toggleAppearance="neutral"
      toggleDisabled={hasSelectedMachines}
      toggleLabel="Add hardware"
    />
  );
};

export default AddHardwareMenu;
