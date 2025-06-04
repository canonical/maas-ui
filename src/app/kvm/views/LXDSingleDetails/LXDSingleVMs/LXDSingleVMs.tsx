import { useSelector } from "react-redux";

import { useWindowTitle } from "@/app/base/hooks";
import type { SetSearchFilter } from "@/app/base/types";
import LXDHostVMs from "@/app/kvm/components/LXDHostVMs";
import type { KVMSetSidePanelContent } from "@/app/kvm/types";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  readonly id: Pod["id"];
  readonly searchFilter: string;
  readonly setSidePanelContent: KVMSetSidePanelContent;
  readonly setSearchFilter: SetSearchFilter;
};

export enum Label {
  Title = "LXD VMs",
}

const LXDSingleVMs = ({
  id,
  searchFilter,
  setSidePanelContent,
  setSearchFilter,
}: Props): React.ReactElement => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  useWindowTitle(`${pod?.name || "LXD"} virtual machines`);

  return (
    <LXDHostVMs
      aria-label={Label.Title}
      hostId={id}
      searchFilter={searchFilter}
      setSearchFilter={setSearchFilter}
      setSidePanelContent={setSidePanelContent}
    />
  );
};

export default LXDSingleVMs;
