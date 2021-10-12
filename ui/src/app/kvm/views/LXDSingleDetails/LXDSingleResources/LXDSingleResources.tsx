import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useWindowTitle } from "app/base/hooks";
import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";
import KVMStorageCards from "app/kvm/components/KVMStorageCards";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const LXDSingleResources = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, id)
  );
  useWindowTitle(`LXD resources ${pod?.name || ""}`);

  if (!pod) {
    return <Spinner text="Loading" />;
  }
  return (
    <>
      <Strip className="u-no-padding--top" shallow>
        <KVMResourcesCard id={pod.id} />
      </Strip>
      <Strip shallow>
        <KVMStorageCards pools={sortedPools} />
      </Strip>
    </>
  );
};

export default LXDSingleResources;
