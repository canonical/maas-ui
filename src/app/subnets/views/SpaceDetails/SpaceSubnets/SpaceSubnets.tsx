import type { ReactElement } from "react";
import { useEffect } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import { useDispatch, useSelector } from "react-redux";

import TitledSection from "@/app/base/components/TitledSection";
import type { RootState } from "@/app/store/root/types";
import type { Space } from "@/app/store/space/types";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import { vlanActions } from "@/app/store/vlan";
import vlanSelectors from "@/app/store/vlan/selectors";
import useSpaceSubnetsColumns from "@/app/subnets/views/SpaceDetails/SpaceSubnets/useSpaceSubnetsColumns/useSpaceSubnetsColumns";
import { simpleSortByKey } from "@/app/utils";

import "./_index.scss";

const SpaceSubnets = ({ space }: { space: Space }): ReactElement => {
  const vlans = useSelector(vlanSelectors.all);
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getBySpace(state, space.id)
  );
  const dispatch = useDispatch();
  const vlansLoading = useSelector(vlanSelectors.loading);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);

  useEffect(() => {
    if (!subnetsLoaded) dispatch(subnetActions.fetch());
    if (!vlansLoaded) dispatch(vlanActions.fetch());
  }, [dispatch, subnetsLoaded, vlansLoaded]);

  const columns = useSpaceSubnetsColumns(vlans);

  return (
    <TitledSection title="Subnets on this space">
      <GenericTable
        columns={columns}
        data={subnets.sort(simpleSortByKey("cidr"))}
        isLoading={vlansLoading || subnetsLoading}
        noData="There are no subnets on this space."
      />
    </TitledSection>
  );
};

export default SpaceSubnets;
