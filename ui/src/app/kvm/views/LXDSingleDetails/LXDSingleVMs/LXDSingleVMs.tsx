import { useSelector } from "react-redux";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import LXDHostVMs from "app/kvm/components/LXDHostVMs";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
  searchFilter: string;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const LXDSingleVMs = ({
  id,
  searchFilter,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  useWindowTitle(`${pod?.name || "LXD"} virtual machines`);

  return (
    <LXDHostVMs
      hostId={id}
      onRefreshClick={() =>
        setHeaderContent({
          view: KVMHeaderViews.REFRESH_KVM,
          extras: { hostId: id },
        })
      }
      searchFilter={searchFilter}
      setSearchFilter={setSearchFilter}
      setHeaderContent={setHeaderContent}
    />
  );
};

export default LXDSingleVMs;
