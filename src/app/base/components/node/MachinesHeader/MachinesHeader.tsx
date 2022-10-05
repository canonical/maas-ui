import { useEffect } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { matchPath, Link } from "react-router-dom-v5-compat";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import urls from "app/base/urls";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";

type Props = SectionHeaderProps;

export const MachinesHeader = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const poolCount = useSelector(resourcePoolSelectors.count);
  const tagCount = useSelector(tagSelectors.count);
  const { machineCount } = useFetchMachineCount();

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      {...props}
      tabLinks={[
        {
          active: !!matchPath(urls.machines.index, location.pathname),
          component: Link,
          label: `${pluralize("Machine", machineCount, true)}`,
          to: urls.machines.index,
        },
        {
          active: !!matchPath(urls.pools.index, location.pathname),
          component: Link,
          label: `${pluralize("Resource pool", poolCount, true)}`,
          to: urls.pools.index,
        },
        {
          active:
            !!matchPath(urls.tags.index, location.pathname) ||
            !!matchPath(
              { path: urls.tags.tag.index(null), end: false },
              location.pathname
            ),
          component: Link,
          label: `${pluralize("Tag", tagCount, true)}`,
          to: urls.tags.index,
        },
      ]}
      title={"title" in props && !!props.title ? props.title : "Machines"}
    />
  );
};

export default MachinesHeader;
