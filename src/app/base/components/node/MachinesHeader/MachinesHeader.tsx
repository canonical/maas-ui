import { useEffect } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { matchPath, Link } from "react-router-dom-v5-compat";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import machineURLs from "app/machines/urls";
import poolsURLs from "app/pools/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import tagURLs from "app/tags/urls";

type Props = SectionHeaderProps;

export const MachinesHeader = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const machines = useSelector(machineSelectors.all);
  const poolCount = useSelector(resourcePoolSelectors.count);
  const tagCount = useSelector(tagSelectors.count);

  useEffect(() => {
    dispatch(machineActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      {...props}
      tabLinks={[
        {
          active: !!matchPath(machineURLs.machines.index, location.pathname),
          component: Link,
          label: `${pluralize("Machine", machines.length, true)}`,
          to: machineURLs.machines.index,
        },
        {
          active: !!matchPath(poolsURLs.pools, location.pathname),
          component: Link,
          label: `${pluralize("Resource pool", poolCount, true)}`,
          to: poolsURLs.pools,
        },
        {
          active:
            !!matchPath(tagURLs.tags.index, location.pathname) ||
            !!matchPath(tagURLs.tag.index(null, true), location.pathname),
          component: Link,
          label: `${pluralize("Tag", tagCount, true)}`,
          to: tagURLs.tags.index,
        },
      ]}
      title={"title" in props && !!props.title ? props.title : "Machines"}
    />
  );
};

export default MachinesHeader;
