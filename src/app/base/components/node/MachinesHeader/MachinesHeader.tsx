import { useEffect } from "react";

import { useDispatch } from "react-redux";

import type { SectionHeaderProps } from "app/base/components/SectionHeader";
import SectionHeader from "app/base/components/SectionHeader";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import { actions as tagActions } from "app/store/tag";
type Props = SectionHeaderProps & { machineCount: number };

export const MachinesHeader = ({
  machineCount,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      {...props}
      title={"title" in props && !!props.title ? props.title : "Machines"}
    />
  );
};

export default MachinesHeader;
