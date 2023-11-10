import type { SectionHeaderProps } from "@/app/base/components/SectionHeader";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import { actions as resourcePoolActions } from "@/app/store/resourcepool";
import { actions as tagActions } from "@/app/store/tag";
type Props = SectionHeaderProps & { machineCount: number };

export const MachinesHeader = ({
  machineCount,
  ...props
}: Props): JSX.Element => {
  useFetchActions([resourcePoolActions.fetch, tagActions.fetch]);

  return (
    <SectionHeader
      {...props}
      title={"title" in props && !!props.title ? props.title : ""}
    />
  );
};

export default MachinesHeader;
